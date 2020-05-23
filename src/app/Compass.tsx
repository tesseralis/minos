import React from "react"
import { css } from "emotion"
import { scaleLinear } from "d3-scale"

import type { Mino } from "mino/mino"
import { getSize } from "mino/mino"

import { toCartesian } from "math"

import { getAngleScale, getArc } from "./utils"
import {
  getCanonical,
  getParents,
  getChildren,
  getMinoColor,
  getLinkColor,
} from "./graph"
import AdjustableMino from "./AdjustableMino"
import SelectableMino from "./SelectableMino"

function getSpread(maxSpread: number, count: number) {
  return maxSpread * ((count - 1) / count)
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
const outerRadius = radius + 30
const svgSize = outerRadius + 5

function Background() {
  return (
    <g>
      <circle
        className={css`
          pointer-events: initial;
        `}
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
  const [innerHovered, setInnerHovered] = React.useState(false)
  const [hovered, setHovered] = React.useState<Mino | undefined>()
  // TODO these return a set, but we'd like them to return in the same
  // order as the full graph
  const canonical = getCanonical(mino)
  const parents = getParents(canonical)
  const children = getChildren(canonical)
  const gen = getSize(mino)

  // Scale the size of the child and parent blocks so that they are bigger
  // when the mino doesn't have as many children
  const maxNumParents = 7
  const parentSizeScale = scaleLinear().domain([1, maxNumParents]).range([4, 2])
  const parentBlockSize = getBlockSize(gen - 1) * parentSizeScale(parents.size)
  const parentRadius = radius + parents.size * 1.25

  const maxNumChildren = 15
  const childSizeScale = scaleLinear().domain([1, maxNumChildren]).range([3, 1])
  const childBlockSize = getBlockSize(gen + 1) * childSizeScale(children.size)
  const childRadius = radius + children.size * 1.25

  return (
    <svg
      viewBox={`${-svgSize} ${-svgSize} ${svgSize * 2} ${svgSize * 2}`}
      className={css`
        width: 22rem;
        height: 22rem;
        pointer-events: none;
      `}
    >
      <Background />
      {[...parents].map((parent, i) => {
        const getAngle = getAngleScale({
          spread: getSpread(1 / 3, parents.size),
          start: -1 / 4,
          count: parents.size,
        })
        const isHovered = !!hovered && getCanonical(hovered) === parent
        const [x, y] = toCartesian({ radius: parentRadius, angle: getAngle(i) })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        const { fill, stroke } = getMinoColor(parent)
        return (
          <g key={parent}>
            <path
              stroke={isHovered ? "white" : getLinkColor(parent, canonical)}
              strokeWidth={isHovered ? 2 : 1}
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
              fill={fill}
              stroke={isHovered ? "white" : stroke}
            />
          </g>
        )
      })}
      {[...children].map((child, i) => {
        const getAngle = getAngleScale({
          spread: getSpread(15 / 32, children.size),
          start: 1 / 4,
          count: children.size,
          reverse: true,
        })

        const isHovered = !!hovered && getCanonical(hovered) === child
        const [x, y] = toCartesian({
          radius: childRadius,
          angle: getAngle(i),
        })
        const linkPath = getArc([x, y], [0, 0], [0, -radius * 2])
        const { fill, stroke } = getMinoColor(child)
        return (
          <g key={child}>
            <path
              stroke={isHovered ? "white" : getLinkColor(canonical, child)}
              strokeWidth={isHovered ? 2 : 1}
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
              fill={fill}
              stroke={isHovered ? "white" : stroke}
            />
          </g>
        )
      })}
      <circle
        cx={0}
        cy={0}
        r={innerRadius}
        fill="#222"
        stroke="#888"
        opacity={1 / 2}
        className={css`
          pointer-events: initial;
        `}
        onMouseOver={() => setInnerHovered?.(true)}
        onMouseOut={() => setInnerHovered?.(false)}
      />
      <AdjustableMino
        mino={mino}
        cx={0}
        cy={0}
        size={getBlockSize(gen) * 5}
        onHover={setHovered}
        onSelect={onSelect}
        showEditable={innerHovered}
        {...getMinoColor(canonical)}
      />
    </svg>
  )
}
