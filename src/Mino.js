import React, { useState, useCallback } from 'react'
import { css } from 'glamor'
import { getOutline } from './mino/draw'
import { getPoints, getMino } from './mino/mino'
import { getSymmetry } from './mino/transform'

const oOctomino = getMino(0b111101111, 3)

const colorMap = {
  none: 'lightgrey',
  reflectOrtho: 'lightcoral',
  reflectDiag: 'mediumseagreen',
  rotate2: 'royalblue',
  dihedralOrtho: 'violet',
  dihedralDiag: 'orange',
  rotate4: 'gold',
  all: 'turquoise',
}

function getBlockSize(gen) {
  return 3 * (9 - gen)
}

function getStrokeWidth(gen) {
  return 0.5 * (9 - gen)
}

function center(points) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  return (min + max) / 2
}

function getCenter(points) {
  const xs = points.map(p => p[0])
  const ys = points.map(p => p[1])
  return [center(xs), center(ys)]
}

function Square({ cx, cy, r, ...svgProps }) {
  return (
    <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} {...svgProps} />
  )
}

export default function Mino({ mino, cx, cy, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const minoPoints = [...getPoints(mino)]
  const color = colorMap[getSymmetry(mino)]
  const outline = getOutline(minoPoints)

  const multiplier = hovered ? 2 : 1
  const blockSize = getBlockSize(minoPoints.length) * multiplier
  const scaledPoints = outline.map(([x, y]) => [x * blockSize, y * blockSize])
  const [avgX, avgY] = getCenter(scaledPoints)
  const points = scaledPoints.map(([x, y]) => [x - avgX + cx, y - avgY + cy])
  const pointStr = points.map(x => x.join(',')).join(' ')

  const handleClick = useCallback(() => onSelect(mino), [mino])

  const circleStyle = css({
    opacity: 0,
    cursor: 'pointer',
  })

  const svgProps = {
    stroke: selected ? 'red' : 'slategray',
    strokeWidth: getStrokeWidth(minoPoints.length),
  }

  return (
    <>
      <polygon points={pointStr} fill={color} {...svgProps} />
      {mino === oOctomino && (
        <Square cx={cx} cy={cy} r={blockSize / 2} fill="white" {...svgProps} />
      )}
      <circle
        {...circleStyle}
        onClick={handleClick}
        cx={cx}
        cy={cy}
        r={(minoPoints.length * blockSize) / 2}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      />
    </>
  )
}
