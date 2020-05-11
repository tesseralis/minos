import React from "react"
import { css } from "emotion"
import type { Mino } from "mino/mino"
import { getSize } from "mino/mino"

import { TAU, toCartesian } from "math"

import { getArc } from "./utils"
import { meta, linkColors } from "./graph"
import MinoSvg from "./MinoSvg"
import SelectableMino from "./SelectableMino"

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
export default function Compass({ mino, onSelect }: CompassProps) {
  // TODO these return a set, but we'd like them to return in the same
  // order as the full graph
  const { parents, children } = meta[mino]
  const radius = 90
  const svgSize = radius + 20
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
          -TAU / 4 +
          TAU *
            ((0.5 - spread) / 2 + (i / Math.max(numParents - 1, 1)) * spread)
        const [x, y] = toCartesian({ radius, angle })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        return (
          <>
            <path
              stroke={linkColors[parent][mino]}
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
          TAU / 4 +
          TAU *
            ((0.5 - spread) / 2 + (i / Math.max(numChildren - 1, 1)) * spread)
        const [x, y] = toCartesian({ radius, angle })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        // TODO use the color of the actual path link
        return (
          <>
            <path
              stroke={linkColors[mino][child]}
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
