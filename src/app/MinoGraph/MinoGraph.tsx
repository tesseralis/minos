import React, { memo, useMemo, useCallback } from "react"
import { css } from "emotion"
import { memoize } from "lodash-es"
import { scaleLinear } from "d3-scale"

import { Mino, getSize } from "mino"

import { toCartesian } from "math"
import { getArc, getAngleScale } from "app/utils"

import SelectableMino from "app/SelectableMino"
import Background from "./Background"
import PanZoom from "./PanZoom"
import FullScreenSvg from "./FullScreenSvg"

import { colors } from "style/theme"

import {
  NUM_GENERATIONS,
  nodes,
  links,
  getCanonicalParents,
  getCanonicalChildren,
  getMinoColor,
  getLinkColor,
} from "../graph"

const ringRadiusBase = 400
const width = 1400

function ringRadius(gen: number) {
  return ringRadiusBase * Math.tan(((gen / NUM_GENERATIONS) * Math.PI) / 2)
}

function getBlockSize(gen: number) {
  return 2 + (NUM_GENERATIONS - gen) ** 2 / 2
}

const indices: Record<number, [number, number]> = {}
function getIndex(mino: Mino) {
  if (!indices[mino]) {
    const gen = getSize(mino) - 1
    if (!nodes[gen]) {
      throw new Error("gen not found")
    }
    const pos = nodes[gen].indexOf(mino)
    indices[mino] = [gen, pos]
  }
  return indices[mino]
}

const getSpread = scaleLinear()
  .domain([0, NUM_GENERATIONS - 1])
  .range([1 / 9, 1 / 2])

function getMinoAngleScale(gen: number) {
  const spread = getSpread(gen)
  return getAngleScale({
    spread,
    start: 1 / 4,
    count: nodes[gen].length,
    reverse: true,
  })
}

// Get the coordinates of the mino with the given generation and index
function getCoords([gen, i]: [number, number]) {
  const getAngle = getMinoAngleScale(gen)
  return toCartesian({ radius: ringRadius(gen), angle: getAngle(i) })
}

interface OrbitalMinoProps {
  mino: Mino
  gen: number
  i: number
  selected?: Set<Mino>
  onSelect?(mino: Mino): void
  onHover?(mino: Mino): void
}

/**
 * Memoized wrapper around the mino to efficiently calculate it
 */
const OrbitalMino = memo(function ({
  mino,
  gen,
  i,
  selected,
  onSelect,
  onHover,
}: OrbitalMinoProps) {
  const coord = useMemo(() => getCoords([gen, i]), [gen, i])
  return (
    <SelectableMino
      mino={mino}
      coord={coord}
      size={getBlockSize(gen + 1)}
      selected={!!selected?.has(mino)}
      onSelect={onSelect}
      onHover={onHover}
      {...getMinoColor(mino)}
    />
  )
})

interface OrbitalProps {
  minos: Mino[]
  gen: number
  selected?: Set<Mino>
  onSelect?(mino: Mino): void
  onHover?(mino: Mino): void
}

const Orbital = memo(({ minos, ...minoProps }: OrbitalProps) => {
  return (
    <>
      {minos.map((mino, i) => {
        return <OrbitalMino key={mino} mino={mino} i={i} {...minoProps} />
      })}
    </>
  )
})

/**
 * Return the path for the link that goes from the source to target mino.
 * The link is a circular that intersects both points as well as a third point
 * scaled according to the radius of the generation.
 */
const getLinkPath = memoize(function ([srcMino, tgtMino]) {
  const gen = getSize(srcMino)
  const origin = [0, -ringRadius(gen) * 0.75] as const
  const src = getCoords(getIndex(srcMino))
  const tgt = getCoords(getIndex(tgtMino))

  return getArc(src, tgt, origin)
})

interface MinoLinkProps {
  link: [Mino, Mino]
  color: string
  isSelected: boolean
  opacity: number
  strokeWidth: number
}

const MinoLink = memo(
  ({ link, color, isSelected, opacity, strokeWidth }: MinoLinkProps) => {
    return (
      <path
        className={css`
          transition: all 250ms ${isSelected ? "ease-out" : "ease-in"};
          pointer-events: none;
        `}
        style={{
          stroke: isSelected ? colors.highlight : color,
          strokeWidth: strokeWidth * (isSelected ? 3 : 1),
        }}
        d={getLinkPath(link)}
        fill="none"
        opacity={opacity}
      />
    )
  },
)

interface MinoLinksProps {
  links: any[]
  selected: Set<string>
  opacity?: number
}

const MinoLinks = memo(({ links, selected, opacity = 1 }: MinoLinksProps) => {
  return (
    <g>
      {links.map((link, i) => {
        const [srcMino, tgtMino] = link
        const gen = getIndex(srcMino)[0]
        const isSelected = selected.has(link.toString())
        const strokeWidth = 4 / (gen / 2 + 1) ** 2
        return (
          <MinoLink
            key={i}
            link={link}
            color={getLinkColor(srcMino, tgtMino)}
            isSelected={isSelected}
            opacity={opacity}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </g>
  )
})

interface Props {
  selected?: Mino
  onSelect?(mino?: Mino): void
}

export default function MinoGraph({ selected, onSelect }: Props) {
  const parents = selected ? getCanonicalParents(selected) : new Set<Mino>()
  const children = selected ? getCanonicalChildren(selected) : new Set<Mino>()

  // Get the links connecting the selected mino to its parents and children
  const selectedLinks = useMemo(() => {
    const selectedLinks = selected
      ? [...parents]
          .map((p) => [p, selected])
          .concat([...children].map((c) => [selected, c]))
      : []
    return new Set(selectedLinks.map((link) => link.toString()))
  }, [selected, parents, children])

  // Split up the "selected" parent and child minos by generation for performance
  const getSelected = useCallback(
    (gen) => {
      if (!selected) return
      const selectedGen = getSize(selected) - 1
      if (gen === selectedGen) {
        return new Set([selected])
      } else if (gen === selectedGen - 1) {
        return parents
      } else if (gen === selectedGen + 1) {
        return children
      }
    },
    [selected, children, parents],
  )

  return (
    <FullScreenSvg width={width}>
      <Background onClick={() => onSelect?.(undefined)} />
      <PanZoom minZoom={0.125} maxZoom={2} zoomSpeed={0.075}>
        <MinoLinks links={links} selected={selectedLinks} />
        {nodes.map((minoGen, i) => {
          return (
            <Orbital
              minos={minoGen}
              gen={i}
              key={i}
              selected={getSelected(i)}
              onSelect={onSelect}
            />
          )
        })}
      </PanZoom>
    </FullScreenSvg>
  )
}
