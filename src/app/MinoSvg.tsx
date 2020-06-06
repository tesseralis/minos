import { css } from "emotion"
import React from "react"

import { Polyomino, O_OCTOMINO } from "mino"
import { colors } from "style/theme"
import { getAnchor } from "./utils"
import { G, Point, Rect, Polygon } from "./svg"

// TODO figure out why this particular styling is efficient
const style = css`
  transition: stroke 350ms ease-in-out;
`

interface Props {
  mino: Polyomino
  coord: Point
  size: number
  fill: string
  stroke: string
  anchor?: string
  hideInner?: boolean
  onClick?(): void
  onHover?(hovered: boolean): void
}

/**
 * Draws a mino in SVG using the given center x and y coordinates,
 * size, fill, stroke color, etc.
 *
 * @param anchor a string representing where edge of the mino should be anchored
 * (e.g. "top left", "bottom right", "center center")
 */
export default function MinoSvg({
  mino,
  coord,
  size,
  fill,
  stroke,
  anchor = "center center",
  hideInner = false,
  onClick,
  onHover,
}: Props) {
  const [cx, cy] = coord
  const strokeWidth = size / 8
  const minoPoints = mino.coords()
  const outline = mino.outline()
  const scale = ([x, y]: Point) => [x * size, y * size] as Point
  const scaledOutline = outline.map(scale)
  const [avgX, avgY] = getAnchor(scaledOutline, anchor)

  const translate = ([x, y]: Point) => [x - avgX + cx, y - avgY + cy] as Point
  const outlinePoints = scaledOutline.map(translate)

  const points = minoPoints.map(scale).map(translate)

  return (
    <G
      className={
        onClick
          ? css`
              cursor: pointer;
            `
          : undefined
      }
      onClick={onClick}
      onHover={onHover}
    >
      <Polygon
        className={style}
        style={{ stroke }}
        points={outlinePoints}
        fill={fill}
        strokeWidth={strokeWidth}
      />
      {mino.equals(O_OCTOMINO) && (
        <Rect
          fill={colors.bg}
          coord={translate(scale([1, 1]))}
          width={size}
          height={size}
          stroke="none"
        />
      )}
      {points.map((point, i) => (
        <Rect
          className={style}
          style={{ stroke }}
          key={i}
          coord={point}
          width={size}
          height={size}
          fill="none"
          opacity={hideInner ? 0.125 : 1}
          strokeWidth={strokeWidth * 0.75}
        />
      ))}
    </G>
  )
}
