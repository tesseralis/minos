import React from "react"
import { css } from "emotion"
import { scaleLinear } from "d3-scale"

import type { Mino } from "mino/mino"
import { getSize } from "mino/mino"

import { TAU, toCartesian } from "math"

import { getArc } from "./utils"
import { getParents, getChildren, getMinoColor, getLinkColor } from "./graph"
import MinoSvg from "./MinoSvg"
import SelectableMino from "./SelectableMino"

/**
 * Get the scale that can be used to calculate the angle of an index in a list
 * @param maxSpread The maximum spread, in turns
 * The "spread" is dependent on the number of elements:
 * if there is only one element, it will appear in the center.
 * @param start The start index, in turns
 * @param numElements The total number of elements
 */
function getAngleScale(maxSpread: number, start: number, numElements: number) {
  const spread = maxSpread * ((numElements - 1) / numElements)
  const angleStart = start + (1 / 2 - spread) / 2
  return scaleLinear()
    .domain([0, numElements - 1])
    .range([TAU * angleStart, TAU * (angleStart + spread)])
}

function getBlockSize(gen: number) {
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

  // Scale the size of the child and parent blocks so that they are bigger
  // when the mino doesn't have as many children
  const maxNumParents = 6
  const parentSizeScale = scaleLinear().domain([1, maxNumParents]).range([4, 2])
  const parentBlockSize = getBlockSize(gen - 1) * parentSizeScale(parents.size)

  const maxNumChildren = 15
  const childSizeScale = scaleLinear().domain([1, maxNumChildren]).range([3, 1])
  const childBlockSize = getBlockSize(gen + 1) * childSizeScale(children.size)
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
        const getAngle = getAngleScale(1 / 3, -1 / 4, parents.size)
        const [x, y] = toCartesian({ radius, angle: getAngle(i) })
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
        const getAngle = getAngleScale(15 / 32, 1 / 4, children.size)
        const [x, y] = toCartesian({ radius, angle: getAngle(i) })
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
        size={getBlockSize(gen) * 5}
        {...getMinoColor(mino)}
      />
    </svg>
  )
}
