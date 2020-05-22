import { css } from "emotion"
import React from "react"

import type { Point } from "math"
import { getSize, getMino, getPoints } from "mino/mino"
import type { Mino } from "mino/mino"
import { getNeighbors, append } from "mino/generate"
import { getOutline } from "mino/draw"
import { colors } from "style/theme"
import { getCanonical } from "./graph"

const oOctomino = getMino(0b111_101_111, 3)

function getCoordAnchor(ns: number[], anchor: string) {
  const min = Math.min(...ns)
  const max = Math.max(...ns)

  switch (anchor) {
    case "left":
    case "top":
    case "start":
      return min
    case "right":
    case "bottom":
    case "end":
      return max
    case "center":
      return (min + max) / 2
    default:
      throw new Error("invalid anchor")
  }
}

function getAnchor(points: Point[], anchor: string) {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])

  const [yAnchor, xAnchor = yAnchor] = anchor.split(" ")
  return [getCoordAnchor(xs, xAnchor), getCoordAnchor(ys, yAnchor)]
}

// TODO figure out why this particular styling is efficient
// const style = css`
//   transition: stroke 350ms ease-in-out;
// `

interface Props {
  mino: Mino
  cx: number
  cy: number
  size: number
  fill: string
  stroke: string
  anchor?: string
  onSelect?(mino: Mino): void
}

/**
 * Draws a mino in SVG using the given center x and y coordinates,
 * size, fill, stroke color, etc.
 *
 * @param anchor a string representing where edge of the mino should be anchored
 * (e.g. "top left", "bottom right", "center center")
 */
export default function AdjustableMino({
  mino,
  cx,
  cy,
  size,
  fill,
  stroke,
  anchor = "center center",
  onSelect,
}: Props) {
  const strokeWidth = size / 8
  const minoPoints = [...getPoints(mino)]
  const outline = getOutline(minoPoints)
  const scale = ([x, y]: Point) => [x * size, y * size] as Point
  const scaledOutline = outline.map(scale)
  const [avgX, avgY] = getAnchor(scaledOutline, anchor)

  const translate = ([x, y]: Point) => [x - avgX + cx, y - avgY + cy]
  const outlinePoints = scaledOutline.map(translate)
  const outlineStr = outlinePoints.map((x) => x.join(",")).join(" ")

  const points = minoPoints.map(scale).map(translate)
  // const nbrPoints = [...getNeighbors(mino)].map(scale).map(translate)
  const nbrPoints = [...getNeighbors(mino)]

  return (
    <>
      {/* <polygon
        className={style}
        style={{ stroke }}
        points={outlineStr}
        fill={fill}
        strokeWidth={strokeWidth}
      /> */}
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
          className={css`
            cursor: pointer;
            pointer-events: initial;
          `}
          style={{ stroke }}
          key={i}
          x={point[0]}
          y={point[1]}
          width={size}
          height={size}
          fill={fill}
          strokeWidth={strokeWidth * 0.75}
        />
      ))}
      {getSize(mino) < 8 &&
        nbrPoints.map((nbrPoint, i) => {
          const [x, y] = translate(scale(nbrPoint))
          return (
            <rect
              className={css`
                cursor: pointer;
                pointer-events: initial;
                opacity: 0;

                :hover {
                  opacity: 0.5;
                }
              `}
              key={i}
              x={x}
              y={y}
              width={size}
              height={size}
              fill="white"
              strokeWidth={strokeWidth * 0.75}
              onClick={() => onSelect?.(getCanonical(append(mino, nbrPoint)))}
            />
          )
        })}
    </>
  )
}
