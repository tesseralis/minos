import React from "react"
import { css } from "emotion"
import type { Mino } from "mino/mino"
import { getSize } from "mino/mino"

import { TAU, toCartesian } from "math"

import { getArc } from "./utils"
import { getParents, getChildren, getMinoColor, getLinkColor } from "./graph"
import MinoSvg from "./MinoSvg"
import SelectableMino from "./SelectableMino"

function getCompassBlockSize(gen: number) {
  return 25 / (gen + 4)
}

interface Props {
  mino: Mino
  onSelect?(mino: Mino): void
}

const innerRadius = 40
const radius = 90
const outerRadius = radius + 10
const svgSize = radius + 20

function Background() {
  return (
    <g>
      <circle
        cx={0}
        cy={0}
        r={outerRadius}
        fill="#222"
        stroke="#aaa"
        opacity={2 / 3}
      />
      <line
        x1={-outerRadius}
        y1={0}
        x2={-innerRadius}
        y2={0}
        stroke="#aaa"
        strokeWidth={1}
        opacity={2 / 3}
      />
      <line
        x1={innerRadius}
        y1={0}
        x2={outerRadius}
        y2={0}
        stroke="#aaa"
        strokeWidth={1}
        opacity={2 / 3}
      />
    </g>
  )
}

/**
 * Displays a mino and its direct children and parents.
 */
export default function Compass({ mino, onSelect }: Props) {
  // TODO these return a set, but we'd like them to return in the same
  // order as the full graph
  const parents = getParents(mino)
  const children = getChildren(mino)
  const gen = getSize(mino)

  const maxNumParents = 6
  const maxParentSizeMult = 4
  const parentBlockSizeMult =
    maxParentSizeMult - (maxParentSizeMult - 2) * (parents.size / maxNumParents)
  const parentBlockSize = getCompassBlockSize(gen - 1) * parentBlockSizeMult

  // Scale the size of the child blocks so that they are bigger
  // when the mino doesn't have as many children
  const maxNumChildren = 15
  const maxChildSizeMult = 3
  const childBlockSizeMult =
    maxChildSizeMult - (maxChildSizeMult - 1) * (children.size / maxNumChildren)
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
      <Background />
      {[...parents].map((parent, i) => {
        const numParents = parents.size
        const spread = (1 / 3) * ((numParents - 1) / numParents)
        const angle =
          -TAU / 4 +
          TAU *
            ((0.5 - spread) / 2 + (i / Math.max(numParents - 1, 1)) * spread)
        const [x, y] = toCartesian({ radius, angle })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        return (
          <>
            <path
              stroke={getLinkColor(parent, mino)}
              d={linkPath}
              fill="none"
              opacity={0.5}
            />
            <SelectableMino
              mino={parent}
              cx={x}
              cy={y}
              size={parentBlockSize}
              onSelect={onSelect}
              {...getMinoColor(parent)}
            />
          </>
        )
      })}
      {[...children].map((child, i) => {
        const numChildren = children.size
        const spread = (15 / 32) * ((numChildren - 1) / numChildren)
        const angle =
          TAU / 4 +
          TAU *
            ((0.5 - spread) / 2 + (i / Math.max(numChildren - 1, 1)) * spread)
        const [x, y] = toCartesian({ radius, angle })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        return (
          <>
            <path
              stroke={getLinkColor(mino, child)}
              d={linkPath}
              fill="none"
              opacity={0.5}
            />
            <SelectableMino
              mino={child}
              cx={x}
              cy={y}
              size={childBlockSize}
              onSelect={onSelect}
              {...getMinoColor(child)}
            />
          </>
        )
      })}
      <circle
        cx={0}
        cy={0}
        r={innerRadius}
        fill="#222"
        stroke="#888"
        opacity={1 / 2}
      />
      <MinoSvg
        mino={mino}
        cx={0}
        cy={0}
        size={getCompassBlockSize(gen) * 5}
        {...getMinoColor(mino)}
      />
    </svg>
  )
}
