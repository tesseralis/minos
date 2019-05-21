import React from 'react'
import { css } from 'glamor'

import { getPoints, getMino } from './mino/mino'
import { getOutline } from './mino/draw'
import useClickHandler from './useClickHandler'

function Square({ cx, cy, r, ...svgProps }) {
  return (
    <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} {...svgProps} />
  )
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

const oOctomino = getMino(0b111101111, 3)
/**
 * Draws a mino in SVG using the given center x and y coordinates,
 * size, fill, stroke color, etc.
 */
export default function Mino({
  mino,
  cx,
  cy,
  size,
  fill,
  stroke,
  onClick,
  onMouseOver,
  onMouseOut,
}) {
  const strokeWidth = size / 8
  const minoPoints = [...getPoints(mino)]
  const outline = getOutline(minoPoints)
  const scaledOutline = outline.map(([x, y]) => [x * size, y * size])
  const [avgX, avgY] = getCenter(scaledOutline)
  const outlinePoints = scaledOutline.map(([x, y]) => [
    x - avgX + cx,
    y - avgY + cy,
  ])
  const outlineStr = outlinePoints.map(x => x.join(',')).join(' ')

  const scaledPoints = minoPoints.map(([x, y]) => [x * size, y * size])
  const points = scaledPoints.map(([x, y]) => [x - avgX + cx, y - avgY + cy])

  const handleClick = useClickHandler(onClick)

  const circleStyle = css({
    opacity: 0,
    cursor: 'pointer',
  })

  const style = css({
    stroke,
    strokeWidth,
  })

  return (
    <>
      {points.map((point, i) => (
        <rect
          key={i}
          x={point[0]}
          y={point[1]}
          width={size}
          height={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth * 0.75}
        />
      ))}
      <polygon points={outlineStr} fill="none" {...style} />
      {mino === oOctomino && (
        <Square cx={cx} cy={cy} r={size / 2} fill="none" {...style} />
      )}
      {/* TODO maybe move this logic out of here? */}
      <circle
        {...circleStyle}
        {...handleClick}
        cx={cx}
        cy={cy}
        r={(minoPoints.length * size) / 2}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />
    </>
  )
}
