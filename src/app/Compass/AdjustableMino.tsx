import { css } from "emotion"
import React from "react"
import tinycolor from "tinycolor2"

import type { Point } from "math"
import { getMino, isValid, getSize, getPoints, getNeighbors } from "mino/mino"
import type { Mino } from "mino/mino"
import { addSquare, removeSquare } from "mino/modify"
import { getOutline } from "mino/draw"
import { getAnchor } from "app/utils"
import { colors } from "style/theme"

const oOctomino = getMino(0b111_101_111, 3)

interface Props {
  mino: Mino
  cx: number
  cy: number
  size: number
  fill: string
  stroke: string
  anchor?: string
  showEditable?: boolean
  onHover?(mino?: Mino): void
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
  showEditable,
  anchor = "center center",
  onHover,
  onSelect,
}: Props) {
  const [hovered, setHovered] = React.useState(false)
  const showSquares = showEditable || hovered

  const hoverEvents = (mino: Mino) => ({
    onMouseOver: () => {
      onHover?.(mino)
      setHovered(true)
    },
    onMouseOut: () => {
      onHover?.()
      setHovered(false)
    },
  })

  const strokeWidth = size / 8
  const minoPoints = [...getPoints(mino)]
  const outline = getOutline(minoPoints)
  const scale = ([x, y]: Point) => [x * size, y * size] as Point
  const scaledOutline = outline.map(scale)
  const [avgX, avgY] = getAnchor(scaledOutline, anchor)

  const translate = ([x, y]: Point) => [x - avgX + cx, y - avgY + cy]
  const nbrPoints = [...getNeighbors(mino)]

  return (
    <g>
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
      {/* Draw the neighboring points of the mino that can be clicked */}
      {getSize(mino) < 8 &&
        nbrPoints.map((nbrPoint, i) => {
          const [x, y] = translate(scale(nbrPoint))
          const child = addSquare(mino, nbrPoint)
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
              fill={colors.highlight}
              stroke="gray"
              strokeWidth={strokeWidth * 0.75}
              onClick={() => onSelect?.(child)}
              {...hoverEvents(child)}
            />
          )
        })}
      {minoPoints.map((point, i) => {
        const [x, y] = translate(scale(point))
        // Make all removable points in the mino selectable
        const parent = removeSquare(mino, point)
        const canRemove = isValid(parent)
        return (
          <rect
            className={css`
              fill: ${fill};
              ${canRemove &&
              css`
                fill: ${showSquares &&
                tinycolor(fill).lighten(20).saturate(10).toString()};
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
            onClick={() => canRemove && onSelect?.(parent)}
            {...hoverEvents(parent)}
          />
        )
      })}
    </g>
  )
}
