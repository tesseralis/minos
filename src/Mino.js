import React, { memo, useState, useCallback } from 'react'
import { css } from 'glamor'
import { getOutline } from './mino/draw'
import { getPoints, getMino } from './mino/mino'
import { getSymmetry } from './mino/transform'

const oOctomino = getMino(0b111101111, 3)

const colorMap = {
  none: 'wheat',
  reflectOrtho: 'lightcoral',
  reflectDiag: 'mediumseagreen',
  rotate2: 'dodgerblue',
  dihedralOrtho: 'gold',
  dihedralDiag: 'turquoise',
  rotate4: 'violet',
  all: 'azure',
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

const Mino = memo(({ mino, cx, cy, selected, onSelect }) => {
  const [hovered, setHovered] = useState(false)
  const minoPoints = [...getPoints(mino)]
  const color = colorMap[getSymmetry(mino)]
  const outline = getOutline(minoPoints)

  const multiplier = hovered ? 2 : 1
  // TODO refactor these calculations
  const unitSize = getBlockSize(minoPoints.length)
  const blockSize = unitSize * multiplier
  const scaledOutline = outline.map(([x, y]) => [x * blockSize, y * blockSize])
  const [avgX, avgY] = getCenter(scaledOutline)
  const outlinePoints = scaledOutline.map(([x, y]) => [
    x - avgX + cx,
    y - avgY + cy,
  ])
  const outlineStr = outlinePoints.map(x => x.join(',')).join(' ')

  const scaledPoints = minoPoints.map(([x, y]) => [
    x * blockSize,
    y * blockSize,
  ])
  const points = scaledPoints.map(([x, y]) => [x - avgX + cx, y - avgY + cy])

  const handleClick = useCallback(() => onSelect(mino), [mino])

  const circleStyle = css({
    opacity: 0,
    cursor: 'pointer',
  })

  const style = css({
    stroke: selected ? 'steelblue' : 'slategray',
    strokeWidth: getStrokeWidth(minoPoints.length),
  })

  return (
    <>
      {points.map(point => (
        <rect
          x={point[0]}
          y={point[1]}
          width={blockSize}
          height={blockSize}
          fill={color}
          stroke="slategray"
          strokeWidth={getStrokeWidth(minoPoints.length) / 2}
        />
      ))}
      <polygon points={outlineStr} fill="none" {...style} />
      {mino === oOctomino && (
        <Square cx={cx} cy={cy} r={blockSize / 2} fill="none" {...style} />
      )}
      <circle
        {...circleStyle}
        onClick={handleClick}
        cx={cx}
        cy={cy}
        r={(minoPoints.length * unitSize) / 2}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      />
    </>
  )
})

export default Mino
