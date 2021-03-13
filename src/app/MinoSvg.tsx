import { css } from "emotion"
import React from "react"

import Vector from "vector"
import { Polyomino, O_OCTOMINO } from "mino"
import { colors } from "style/theme"
import { getAnchor } from "./utils"
import { G, Rect, Polygon } from "./svg"

// TODO figure out why this particular styling is efficient
const style = css`
  transition: stroke 350ms ease-in-out;
`

interface Props {
  mino: Polyomino
  coord: Vector
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
  const strokeWidth = size / 8
  const minoPoints = mino.coords()
  const outline = mino.outline()
  const scale = (v: Vector) => v.scale(size)
  const scaledOutline = outline.map(scale)
  const anchorPoint = getAnchor(scaledOutline, anchor)

  const translate = (v: Vector) => v.sub(anchorPoint).add(coord)
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
          coord={translate(scale(new Vector(1, 1)))}
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
          opacity={hideInner ? 0.0625 : 1}
          strokeWidth={strokeWidth * 0.75}
        />
      ))}
    </G>
  )
}
