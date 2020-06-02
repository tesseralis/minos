import React, { memo, useMemo, useCallback } from "react"
import { css } from "emotion"
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
  getIndex,
} from "../graph"

const ringRadiusBase = 400
const width = 1400

function ringRadius(gen: number) {
  return (
    ringRadiusBase * Math.tan((((gen - 1) / NUM_GENERATIONS) * Math.PI) / 2)
  )
}

function getBlockSize(gen: number) {
  return 2 + (NUM_GENERATIONS - gen) ** 2 / 2
}

const getSpread = scaleLinear()
  .domain([1, NUM_GENERATIONS])
  .range([1 / 9, 1 / 2])

function getMinoAngleScale(gen: number) {
  const spread = getSpread(gen)
  return getAngleScale({
    spread,
    start: 1 / 4,
    count: nodes[gen - 1].length,
    reverse: true,
  })
}

// Get the coordinates of the mino with the given generation and index
function getCoords(gen: number, i: number) {
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
const RingMino = memo(function ({
  mino,
  gen,
  i,
  selected,
  onSelect,
  onHover,
}: OrbitalMinoProps) {
  const coord = useMemo(() => getCoords(gen, i), [gen, i])
  return (
    <SelectableMino
      mino={mino}
      coord={coord}
      size={getBlockSize(gen)}
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

/**
 * A semicircle containing all the minos in a generation.
 */
const GenerationRing = memo(({ minos, ...minoProps }: OrbitalProps) => {
  return (
    <>
      {minos.map((mino, i) => {
        return <RingMino key={mino} mino={mino} i={i} {...minoProps} />
      })}
    </>
  )
})

/**
 * Return the path for the link that goes from the source to target mino.
 * The link is a circular that intersects both points as well as a third point
 * scaled according to the radius of the generation.
 */
function getLinkPath([srcMino, tgtMino]: [Mino, Mino]) {
  const gen = getSize(srcMino)
  const origin = [0, -1 - ringRadius(gen) * 0.75] as const
  const src = getCoords(gen, getIndex(srcMino))
  const tgt = getCoords(gen + 1, getIndex(tgtMino))

  return getArc(src, tgt, origin)
}

interface MinoLinkProps {
  link: [Mino, Mino]
  isSelected: boolean
}

const MinoLink = memo(({ link, isSelected }: MinoLinkProps) => {
  const [srcMino, tgtMino] = link
  const gen = getSize(srcMino)
  const strokeWidth = 4 / ((gen - 1) / 2 + 1) ** 2
  return (
    <path
      className={css`
        transition: all 250ms ${isSelected ? "ease-out" : "ease-in"};
        pointer-events: none;
      `}
      style={{
        stroke: isSelected ? colors.highlight : getLinkColor(srcMino, tgtMino),
        strokeWidth: strokeWidth * (isSelected ? 3 : 1),
      }}
      d={getLinkPath(link)}
      fill="none"
    />
  )
})

interface MinoLinksProps {
  links: any[]
  selected: Set<string>
}

const MinoLinks = memo(({ links, selected }: MinoLinksProps) => {
  return (
    <g>
      {links.map((link, i) => {
        const isSelected = selected.has(link.toString())
        return <MinoLink key={i} link={link} isSelected={isSelected} />
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
            <GenerationRing
              minos={minoGen}
              gen={i + 1}
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
