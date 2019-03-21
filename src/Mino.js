import React from 'react'
import { getOutline } from './mino/draw'

const colors = [
  '',
  'tomato',
  'darkorange',
  'gold',
  'lightgreen',
  'lightskyblue',
  'plum',
]

function getCenter(points) {
  const xs = points.map(p => p[0])
  const ys = points.map(p => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  return [(minX + maxX) / 2, (minY + maxY) / 2]
}

export default function Mino({ mino, cx, cy, onHover }) {
  const color = colors[mino.length]
  const outline = getOutline(mino)

  const blockSize = 50
  const scaledPoints = outline.map(([x, y]) => [x * blockSize, y * blockSize])
  const [avgX, avgY] = getCenter(scaledPoints)
  const points = scaledPoints.map(([x, y]) => [x - avgX + cx, y - avgY + cy])

  const pointStr = points.map(x => x.join(',')).join(' ')

  return (
    <g onMouseOver={onHover}>
      <polygon points={pointStr} stroke="slategray" fill={color} />
    </g>
  )
}
