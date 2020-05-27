import { isEqual } from "lodash-es"
import { css } from "emotion"
import React from "react"
import tinycolor from "tinycolor2"

import {
  Mino,
  Coord,
  RelativeLink,
  isValid,
  getCoords,
  getNeighbors,
  addSquare,
  removeSquare,
  getOutline,
  O_OCTOMINO,
} from "mino"
import { Point, Rect } from "app/svg"
import { getAnchor } from "app/utils"
import { colors } from "style/theme"

interface Props {
  mino: Mino
  coord?: Point
  size: number
  fill: string
  stroke: string
  anchor?: string
  showChildren?: boolean
  showEditable?: boolean
  hovered?: RelativeLink
  onHover?(link?: RelativeLink): void
  onSelect?(mino: Mino): void
}

// TODO There's some logic duplicated here from `MinoSvg`.

/**
 * Renders a mino that can have squares added or removed from it.
 */
export default function AdjustableMino({
  mino,
  coord: [cx, cy] = [0, 0],
  size,
  fill,
  stroke,
  showEditable,
  showChildren,
  anchor = "center center",
  hovered,
  onHover,
  onSelect,
}: Props) {
  const [innerHovered, setInnerHovered] = React.useState(false)
  const showSquares = showEditable || innerHovered

  function hoverHandler(mino: Mino, coord: Coord) {
    return (hovered: boolean) => {
      onHover?.(hovered ? { mino, coord } : undefined)
      setInnerHovered(hovered)
    }
  }

  function isHovered(coord: Coord) {
    return isEqual(hovered?.coord, coord)
  }

  const strokeWidth = size / 8
  const minoPoints = [...getCoords(mino)]
  const outline = getOutline(minoPoints)
  const scale = ([x, y]: Point) => [x * size, y * size] as Point
  const scaledOutline = outline.map(scale)
  const [avgX, avgY] = getAnchor(scaledOutline, anchor)

  const translate = ([x, y]: Point) => [x - avgX + cx, y - avgY + cy] as Point
  const nbrPoints = [...getNeighbors(mino)]

  return (
    <g>
      {mino === O_OCTOMINO && (
        <Rect
          fill={colors.bg}
          coord={translate(scale([1, 1]))}
          width={size}
          height={size}
          stroke="none"
        />
      )}
      {/* Draw the neighboring points of the mino that can be clicked */}
      {showChildren &&
        nbrPoints.map((nbrPoint, i) => {
          const child = addSquare(mino, nbrPoint)
          return (
            <Rect
              className={css`
                cursor: pointer;
                pointer-events: initial;
                opacity: ${isHovered(nbrPoint) ? 0.5 : 0};
              `}
              key={i}
              coord={translate(scale(nbrPoint))}
              width={size}
              height={size}
              fill={colors.highlight}
              stroke="gray"
              strokeWidth={strokeWidth * 0.75}
              onClick={() => onSelect?.(child)}
              onHover={hoverHandler(child, nbrPoint)}
            />
          )
        })}
      {minoPoints.map((point, i) => {
        // Make all removable points in the mino selectable
        const parent = removeSquare(mino, point)
        const canRemove = isValid(parent)
        return (
          <Rect
            className={css`
              fill: ${fill};
              ${canRemove &&
              css`
                fill: ${isHovered(point)
                  ? tinycolor.mix(fill, "white", 80).toString()
                  : showSquares
                  ? tinycolor.mix(fill, "white", 50).toString()
                  : fill};
                cursor: pointer;
                pointer-events: initial;
              `}
            `}
            style={{ stroke }}
            key={i}
            coord={translate(scale(point))}
            width={size}
            height={size}
            strokeWidth={strokeWidth * 0.75}
            onClick={() => canRemove && onSelect?.(parent)}
            onHover={hoverHandler(parent, point)}
          />
        )
      })}
    </g>
  )
}
