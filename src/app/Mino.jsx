import React from 'react'
import { css } from 'glamor'

import { getMino, getPoints } from 'mino/mino'
import { getOutline } from 'mino/draw'
import { colors } from 'style/theme'

const oOctomino = getMino(0b111101111, 3)

function getCoordAnchor(ns, anchor) {
  const min = Math.min(...ns)
  const max = Math.max(...ns)

  switch (anchor) {
    case 'left':
    case 'top':
    case 'start':
      return min
    case 'right':
    case 'bottom':
    case 'end':
      return max
    case 'center':
      return (min + max) / 2
    default:
      throw new Error('invalid anchor')
  }
}

function getAnchor(points, anchor) {
  const xs = points.map(p => p[0])
  const ys = points.map(p => p[1])

  const [yAnchor, xAnchor = yAnchor] = anchor.split(' ')
  return [getCoordAnchor(xs, xAnchor), getCoordAnchor(ys, yAnchor)]
}

// TODO figure out why this particular styling is efficient
const style = css({
  transition: 'stroke 350ms ease-in-out',
})

/**
 * Draws a mino in SVG using the given center x and y coordinates,
 * size, fill, stroke color, etc.
 *
 * @param anchor a string representing where edge of the mino should be anchored
 * (e.g. "top left", "bottom right", "center center")
 */
export default function Mino({
  mino,
  cx,
  cy,
  size,
  fill,
  stroke,
  anchor = 'center center',
}) {
  const strokeWidth = size / 8
  const minoPoints = [...getPoints(mino)]
  const outline = getOutline(minoPoints)
  const scale = ([x, y]) => [x * size, y * size]
  const scaledOutline = outline.map(scale)
  const [avgX, avgY] = getAnchor(scaledOutline, anchor)

  const translate = ([x, y]) => [x - avgX + cx, y - avgY + cy]
  const outlinePoints = scaledOutline.map(translate)
  const outlineStr = outlinePoints.map(x => x.join(',')).join(' ')

  const points = minoPoints.map(scale).map(translate)

  return (
    <>
      <polygon
        {...style}
        style={{ stroke }}
        points={outlineStr}
        fill={fill}
        strokeWidth={strokeWidth}
      />
      {mino === oOctomino && (
        <rect
          fill={colors.bg}
          x={cx - size / 2}
          y={cy - size / 2}
          width={size}
          height={size}
          stroke="none"
        />
      )}
      {points.map((point, i) => (
        <rect
          {...style}
          style={{ stroke }}
          key={i}
          x={point[0]}
          y={point[1]}
          width={size}
          height={size}
          fill="none"
          strokeWidth={strokeWidth * 0.75}
        />
      ))}
    </>
  )
}
