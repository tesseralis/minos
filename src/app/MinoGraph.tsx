import React, { memo, useState, useCallback, useMemo } from "react"
import { css } from "emotion"
import styled from "@emotion/styled"
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
 * Return the path for the link that goes from the source to target mino.
 * The link is a circular that intersects both points as well as a third point
 * scaled according to the radius of the generation.
 */
const getLinkPath = memoize(function ([srcMino, tgtMino]) {
  const gen = getSize(srcMino)
  const origin: Point = [0, -ringRadius(gen) * 0.75]
  const src = getCoords(getIndex(srcMino))
  const tgt = getCoords(getIndex(tgtMino))

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
})

interface OrbitalProps {
  minos: Mino[]
  gen: number
  selected?: Set<Mino>
  onSelect(mino: Mino): void
  onHover(mino: Mino): void
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
              color={meta[mino].color!.toHexString()}
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

function Svg({ width, children }: { width: number; children: any }) {
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
        grid-row: 1;
        grid-column: 1 / span 2;
        background-color: ${colors.bg};
      `}
      viewBox={viewBox}
    >
      {children}
    </svg>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 24rem;
  width: 100%;
  height: 100%;
`

interface SidebarProps {
  mino: Mino
}

function Sidebar({ mino }: SidebarProps) {
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.125);
        grid-row: 1;
        grid-column: 2;
      `}
    >
      <svg
        viewBox="-200 -200 400 400"
        className={css`
          width: 100%;
          height: 24rem;
        `}
      >
        <MinoSvg
          mino={mino}
          cx={0}
          cy={0}
          size={25}
          fill={meta[mino].color!.toString()}
          stroke={meta[mino].borderColor!}
        />
      </svg>
    </div>
  )
}

export default memo(function MinoGraph() {
  const [selected, setSelected] = useState<Mino | undefined>()
  const [hovered, setHovered] = useState<Mino | undefined>()

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
    <Wrapper>
      <Svg width={width}>
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
                onHover={setHovered}
              />
            )
          })}
        </PanZoom>
        {/* Overlay showing the currently hovered mino */}
        {/* {hovered && (
        <MinoSvg
          mino={hovered}
          fill={meta[hovered].color!.toString()}
          stroke={meta[hovered].borderColor!}
          size={32}
          cx={32}
          cy={32}
          anchor="top left"
        />
      )} */}
      </Svg>
      {selected && <Sidebar key={selected} mino={selected} />}
    </Wrapper>
  )
})
