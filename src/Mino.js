import React, { useState, useCallback } from 'react'
import { getOutline } from './mino/draw'
import { getPoints } from './mino/mino'

const colors = [
  '',
  'grey',
  'tan',
  'tomato',
  'darkorange',
  'gold',
  'lightgreen',
  'lightskyblue',
  'plum',
]

function getBlockSize(gen) {
  return 3 * (9 - gen)
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

export default function Mino({ mino, cx, cy, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const minoPoints = [...getPoints(mino)]
  const color = colors[minoPoints.length]
  const outline = getOutline(minoPoints)

  const multiplier = hovered || selected ? 2 : 1
  const blockSize = getBlockSize(minoPoints.length) * multiplier
  const scaledPoints = outline.map(([x, y]) => [x * blockSize, y * blockSize])
  const [avgX, avgY] = getCenter(scaledPoints)
  const points = scaledPoints.map(([x, y]) => [x - avgX + cx, y - avgY + cy])
  const pointStr = points.map(x => x.join(',')).join(' ')

  const handleClick = useCallback(() => onSelect(mino), [mino])

  return (
    <>
      <polygon
        points={pointStr}
        stroke={selected ? 'red' : 'slategray'}
        fill={color}
      />
      <circle
        onClick={handleClick}
        opacity={0}
        cx={cx}
        cy={cy}
        r={(minoPoints.length * blockSize) / 2}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      />
    </>
  )
}
