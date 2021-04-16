import { css } from "@emotion/css"
import React from "react"
import { path as d3path } from "d3-path"

import Vector from "vector"
import { Polyomino, O_OCTOMINO } from "mino"
import { colors } from "style/theme"
import { getAnchor } from "./utils"
import { G, Rect, Polygon } from "./svg"

// TODO figure out why this particular styling is efficient
// TODO re-enable this when we need
const style = css`
  transition: stroke 350ms ease-in-out;
`

export interface Props {
  mino: Polyomino
  coord: Vector
  size: number
  fill: string
  stroke: string
  anchor?: string
  gridStyle?: "thick" | "thin" | "none"
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
  gridStyle = "thick",
  onClick,
  onHover,
}: Props) {
  const strokeWidth = size / 8
  const outline = mino.boundary().outline()
  const scale = (v: Vector) => v.scale(size)
  const scaledOutline = outline.map(scale)
  const anchorPoint = getAnchor(scaledOutline, anchor)

  const translate = (v: Vector) => v.sub(anchorPoint).add(coord)
  const outlinePoints = scaledOutline.map(translate)

  const minoPoints = mino.coords()
  const points = minoPoints.map(scale).map(translate)
  const path = d3path()
  for (const point of points) {
    path.moveTo(point.x, point.y + size)
    path.lineTo(point.x, point.y)
    path.lineTo(point.x + size, point.y)
  }

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
      {gridStyle !== "none" && (
        <path
          d={path.toString()}
          className={style}
          style={{ stroke }}
          fill="none"
          opacity={gridStyle === "thick" ? 1 : 0.25}
          strokeWidth={strokeWidth * 0.5}
        />
      )}
    </G>
  )
}
