import React from "react"
import { css } from "emotion"
import { scaleLinear } from "d3-scale"

import { toCartesian } from "math"
import type { Point } from "math"

import type { Mino } from "mino/mino"
import { getSize } from "mino/mino"

import { getAngleScale, getArc } from "./utils"
import {
  canonicalEquals,
  getSortedParents,
  getSortedChildren,
  getMinoColor,
  getLinkColor,
  MAX_NUM_CHILDREN,
  MAX_NUM_PARENTS,
} from "./graph"

import AdjustableMino from "./AdjustableMino"
import SelectableMino from "./SelectableMino"
import SymmetryRing from "./SymmetryRing"

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

  interface StrandProps {
    // the relative mino represented by this strand
    mino: number
    // color of the link
    linkColor: string
    // block size of the relative mino
    size: number
    // x and y coordinates of the relative mino
    coords: Point
  }

  /**
   * A link to a parent or child mino
   */
  function Strand({ mino, linkColor, coords, size }: StrandProps) {
    const isHovered = !!hovered && canonicalEquals(hovered, mino)
    const linkPath = getArc(coords, [0, 0], [0, -radius * 2])
    const { fill, stroke } = getMinoColor(mino)
    return (
      <g>
        <path
          stroke={isHovered ? "white" : linkColor}
          strokeWidth={isHovered ? 2 : 1}
          d={linkPath}
          fill="none"
          opacity={0.5}
        />
        <SelectableMino
          mino={isHovered ? hovered! : mino}
          cx={coords[0]}
          cy={coords[1]}
          size={size}
          onHover={setHovered}
          onSelect={onSelect}
          fill={fill}
          stroke={isHovered ? "white" : stroke}
        />
      </g>
    )
  }

  interface StrandsProps {
    // The set of minos to render as strands
    minos: Mino[]
    // The maximum number of minos that can be rendered
    maxNumMinos: number
    // The maximum and minimum amount to scale up each mino
    scaleRange: [number, number]
    // The maximum angle (in turns) that the minos can be fanned out
    maxSpread: number
    // The angle (in turns) to start the spread
    spreadStart: number
    // Whether to reverse the order of minos
    reverse?: boolean
    // Function to determine the color of the link
    linkColor(mino: Mino): string
  }

  /**
   * Links to a set of minos (e.g. the parents or children)
   */
  function Strands({
    minos,
    maxNumMinos,
    scaleRange,
    maxSpread,
    spreadStart,
    reverse,
    linkColor,
  }: StrandsProps) {
    const gen = getSize(minos[0])
    const numMinos = minos.length
    // Scale up each mino based on how many minos there are.
    // The less minos compared to the max possible, the larger the scaling
    const sizeScale = scaleLinear().domain([1, maxNumMinos]).range(scaleRange)
    const scaledSize = getBlockSize(gen) * sizeScale(numMinos)
    // Scale up the radius so that the more minos there are,
    // the further away from the center
    const scaledRadius = radius + numMinos * 1.25
    const getAngle = getAngleScale({
      spread: getSpread(maxSpread, numMinos),
      start: spreadStart,
      count: numMinos,
      reverse,
    })
    return (
      <g>
        {[...minos].map((m, i) => {
          return (
            <Strand
              key={m}
              mino={m}
              linkColor={linkColor(m)}
              size={scaledSize}
              coords={toCartesian({
                radius: scaledRadius,
                angle: getAngle(i),
              })}
            />
          )
        })}
      </g>
    )
  }

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
      <Strands
        minos={getSortedParents(mino)}
        maxNumMinos={MAX_NUM_PARENTS}
        scaleRange={[4, 2]}
        maxSpread={1 / 3}
        spreadStart={-1 / 4}
        linkColor={(parent: Mino) => getLinkColor(parent, mino)}
      />
      <Strands
        minos={getSortedChildren(mino)}
        maxNumMinos={MAX_NUM_CHILDREN}
        scaleRange={[3, 1]}
        maxSpread={15 / 32}
        spreadStart={1 / 4}
        reverse
        linkColor={(child: Mino) => getLinkColor(mino, child)}
      />
      <SymmetryRing
        mino={mino}
        radius={innerRadius}
        onHover={setInnerHovered}
      />
      <AdjustableMino
        mino={mino}
        cx={0}
        cy={0}
        size={getBlockSize(getSize(mino)) * 5}
        onHover={setHovered}
        onSelect={onSelect}
        showEditable={innerHovered}
        {...getMinoColor(mino)}
      />
    </svg>
  )
}
