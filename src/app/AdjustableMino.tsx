import { css } from "emotion"
import React from "react"
import tinycolor from "tinycolor2"

import type { Point } from "math"
import { getSize, getPoints } from "mino/mino"
import type { Mino } from "mino/mino"
import { getNeighbors } from "mino/generate"
import { addSquare, removeSquare } from "mino/modify"
import { getOutline } from "mino/draw"
import { isParent, getCanonical } from "./graph"
import { getAnchor } from "./utils"

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

// TODO There's some logic duplicated here from `MinoSvg`.

/**
 * Renders a mino that can have squares added or removed from it.
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
  const nbrPoints = [...getNeighbors(mino)]

  return (
    <>
      {/* Draw the neighboring points of the mino that can be clicked */}
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
              stroke="gray"
              strokeWidth={strokeWidth * 0.75}
              onClick={() => onSelect?.(addSquare(mino, nbrPoint))}
            />
          )
        })}
      {minoPoints.map((point, i) => {
        const [x, y] = translate(scale(point))
        // Make all removable points in the mino selectable
        // TODO I want to replace this with an `isValid` function
        const canRemove = isParent(
          getCanonical(removeSquare(mino, point)),
          getCanonical(mino),
        )
        return (
          <rect
            className={css`
              fill: ${fill};
              ${canRemove &&
              css`
                /* TODO only highlight when entering the inner circle */
                fill: ${tinycolor(fill).lighten(20).saturate(10).toString()};
                cursor: pointer;
                pointer-events: initial;
                :hover {
                  fill: white;
                }
              `}
            `}
            style={{ stroke }}
            key={i}
            x={x}
            y={y}
            width={size}
            height={size}
            strokeWidth={strokeWidth * 0.75}
            onClick={() => canRemove && onSelect?.(removeSquare(mino, point))}
          />
        )
      })}
    </>
  )
}
