import React, { memo, useState, useCallback, useMemo } from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"
import * as d3 from "d3-path"
import { memoize } from "lodash-es"

import type { Point } from "math"

import {
  equalsToPrecision,
  toCartesian,
  getPointAngle,
  getCircleFromPoints,
} from "math"

import { generateGraph } from "mino/generate"
import { getSize } from "mino/mino"
import type { Mino } from "mino/mino"

import { colors } from "style/theme"

import InfoButton from "./InfoButton"
import Background from "./Background"
import MinoSvg from "./MinoSvg"
import SelectableMino from "./SelectableMino"
import PanZoom from "./PanZoom"

const tau = 2 * Math.PI
const ringRadiusBase = 400
const numGenerations = 8
const width = 1400

const minScale = 1 / 9
const maxScale = 1 / 2

const { nodes, links, meta } = generateGraph(numGenerations)

function ringRadius(gen: number) {
  return ringRadiusBase * Math.tan(((gen / numGenerations) * Math.PI) / 2)
}

function getBlockSize(gen: number) {
  return 2 + (8 - gen) ** 2 / 2
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

// Get the coordinates of the mino with the given generation and index
function getCoords([gen, i]: [number, number]) {
  const radius = ringRadius(gen)
  const total = nodes[gen].length
  const turn = total === 1 ? 0.5 : i / (total - 1)
  const scale = minScale + (gen / (numGenerations - 1)) * (maxScale - minScale)
  const scaledTurn = (scale - 1) / 2 - turn * scale
  const angle = scaledTurn * tau
  return toCartesian({ radius, angle })
}

// Cached colors of each link
const linkColors = links.map((link) => {
  const srcMino = link[0]
  const tgtMino = link[1]
  return tinycolor.mix(meta[srcMino].color!, meta[tgtMino].color!).toHexString()
})

/**
 * Get the path of the circular arc connecting `src` to `tgt`
 * that also passes through `base`.
 */
function getArc(src: Point, tgt: Point, origin: Point) {
  // Special case: If we're colinear, just draw a straight line
  if (
    equalsToPrecision(getPointAngle(origin, src), getPointAngle(origin, tgt))
  ) {
    const path = d3.path()
    path.moveTo(...src)
    path.lineTo(...tgt)
    return path.toString()
  }

  const { radius, center } = getCircleFromPoints(src, tgt, origin)
  const ccw = getPointAngle(origin, src) > getPointAngle(origin, tgt)

  const path = d3.path()
  path.moveTo(...src)
  path.arc(
    center[0],
    center[1],
    radius,
    getPointAngle(center, src),
    getPointAngle(center, tgt),
    ccw,
  )
  return path.toString()
}

/**
 * Return the path for the link that goes from the source to target mino.
 * The link is a circular that intersects both points as well as a third point
 * scaled according to the radius of the generation.
 */
const getLinkPath = memoize(function ([srcMino, tgtMino]) {
  const gen = getSize(srcMino)
  const origin: Point = [0, -ringRadius(gen) * 0.75]
  const src = getCoords(getIndex(srcMino))
  const tgt = getCoords(getIndex(tgtMino))

  return getArc(src, tgt, origin)
})

interface OrbitalProps {
  minos: Mino[]
  gen: number
  selected?: Set<Mino>
  onSelect(mino: Mino): void
  onHover?(mino: Mino): void
}

const Orbital = memo(
  ({ minos, gen, selected, onSelect, onHover }: OrbitalProps) => {
    return (
      <>
        {minos.map((mino, i) => {
          const [x, y] = getCoords([gen, i])
          return (
            <SelectableMino
              selected={!!selected?.has(mino)}
              key={i}
              cx={x}
              cy={y}
              mino={mino}
              size={getBlockSize(gen + 1)}
              fill={meta[mino].color!.toHexString()}
              stroke={meta[mino].borderColor!}
              onSelect={onSelect}
              onHover={onHover}
            />
          )
        })}
      </>
    )
  },
)

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
          stroke: isSelected ? colors.fg : color,
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
        const srcMino = link[0]
        const gen = getIndex(srcMino)[0]
        const isSelected = selected.has(link.toString())
        const strokeWidth = 4 / (gen / 2 + 1) ** 2
        return (
          <MinoLink
            key={i}
            link={link}
            color={linkColors[i]}
            isSelected={isSelected}
            opacity={opacity}
            strokeWidth={strokeWidth}
          />
        )
      })}
    </g>
  )
})

// A full screen SVG
function FullScreenSvg({ width, children }: { width: number; children: any }) {
  // Only change the viewbox if the prop width changes, not the window ratio
  const viewBox = useMemo(() => {
    const height = (width / window.innerWidth) * window.innerHeight
    return `-${width / 2} ${-height / 10} ${width} ${height}`
  }, [width])

  return (
    <svg
      className={css`
        width: 100%;
        height: 100%;
        background-color: ${colors.bg};
      `}
      viewBox={viewBox}
    >
      {children}
    </svg>
  )
}

interface CompassProps {
  mino: Mino
  onSelect?(mino: Mino): void
}

function getCompassBlockSize(gen: number) {
  return 20 / (gen + 1)
}

/**
 * Displays a mino and its direct children and parents.
 */
function Compass({ mino, onSelect }: CompassProps) {
  // TODO these return a set, but we'd like them to return in the same
  // order as the full graph
  const { parents, children } = meta[mino]
  const radius = 90
  const svgSize = radius + 10
  const gen = getSize(mino)

  const parentBlockSize = getCompassBlockSize(gen - 1) * 2

  // Scale the size of the child blocks so that they are bigger
  // when the mino doesn't have as many children
  const maxNumChildren = 2 * gen + 1
  const childBlockSizeMult = 2 - children.size / maxNumChildren
  const childBlockSize = getCompassBlockSize(gen + 1) * childBlockSizeMult
  return (
    <svg
      viewBox={`${-svgSize} ${-svgSize} ${svgSize * 2} ${svgSize * 2}`}
      className={css`
        width: 20rem;
        height: 20rem;
        pointer-events: initial;
      `}
    >
      <circle
        cx={0}
        cy={0}
        r={radius + 10}
        fill="#222"
        stroke="#aaa"
        opacity={2 / 3}
      />
      {[...parents].map((parent, i) => {
        const numParents = parents.size
        const spread = (1 / 3) * ((numParents - 1) / numParents)
        const angle =
          -tau / 4 +
          tau *
            ((0.5 - spread) / 2 + (i / Math.max(numParents - 1, 1)) * spread)
        const [x, y] = toCartesian({ radius, angle })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        return (
          <>
            <path
              stroke={meta[parent].color!.toString()}
              d={linkPath}
              fill="none"
              opacity={0.5}
            />
            <SelectableMino
              mino={parent}
              cx={x}
              cy={y}
              size={parentBlockSize}
              fill={meta[parent].color!.toString()}
              stroke={meta[parent].borderColor!}
              onSelect={onSelect}
            />
          </>
        )
      })}
      {[...children].map((child, i) => {
        const numChildren = children.size
        const spread = (15 / 32) * ((numChildren - 1) / numChildren)
        const angle =
          tau / 4 +
          tau *
            ((0.5 - spread) / 2 + (i / Math.max(numChildren - 1, 1)) * spread)
        const [x, y] = toCartesian({ radius, angle })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        // TODO use the color of the actual path link
        return (
          <>
            <path
              stroke={meta[child].color!.toString()}
              d={linkPath}
              fill="none"
              opacity={0.5}
            />
            <SelectableMino
              mino={child}
              cx={x}
              cy={y}
              size={childBlockSize}
              fill={meta[child].color!.toString()}
              stroke={meta[child].borderColor!}
              onSelect={onSelect}
            />
          </>
        )
      })}
      <MinoSvg
        mino={mino}
        cx={0}
        cy={0}
        size={getCompassBlockSize(gen) * 3}
        fill={meta[mino].color!.toString()}
        stroke={meta[mino].borderColor!}
      />
    </svg>
  )
}

export default memo(function MinoGraph() {
  const [selected, setSelected] = useState<Mino | undefined>()
  // const [hovered, setHovered] = useState<Mino | undefined>()

  // Get the selected links
  const { parents, children } = !!selected ? meta[selected] : ({} as any)

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
      if (!selected) return null
      const selectedGen = getSize(selected) - 1
      if (gen === selectedGen) {
        return new Set([selected])
      } else if (gen === selectedGen - 1) {
        return parents
      } else if (gen === selectedGen + 1) {
        return children
      }
      return null
    },
    [selected, children, parents],
  )

  return (
    <div
      className={css`
        display: grid;
        width: 100%;
        height: 100%;
      `}
    >
      <div
        className={css`
          grid-area: 1 / 1;
        `}
      >
        <FullScreenSvg width={width}>
          <Background onClick={() => setSelected(undefined)} />
          <PanZoom minZoom={0.125} maxZoom={3} zoomSpeed={0.075}>
            <MinoLinks links={links} selected={selectedLinks} />
            {nodes.map((minoGen, i) => {
              return (
                <Orbital
                  minos={minoGen}
                  gen={i}
                  key={i}
                  selected={getSelected(i)}
                  onSelect={setSelected}
                />
              )
            })}
          </PanZoom>
        </FullScreenSvg>
      </div>
      <div
        className={css`
          grid-area: 1 / 1;
          align-self: end;
          justify-self: start;
          padding: 2rem;
        `}
      >
        <InfoButton />
      </div>
      {selected && (
        <div
          key={selected}
          className={css`
            grid-area: 1 / 1;
            align-self: start;
            justify-self: end;
            padding: 2rem;
            pointer-events: none;
          `}
        >
          <Compass mino={selected} onSelect={setSelected} />
        </div>
      )}
    </div>
  )
})
