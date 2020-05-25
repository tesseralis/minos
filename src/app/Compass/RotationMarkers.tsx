import React from "react"

import type { Point } from "math"
import { Polygon, PolygonProps, svgTransform } from "app/svg"
import { colors } from "style/theme"

interface RotMarkerProps extends Omit<PolygonProps, "points"> {
  // if true, render symmetric symbol
  achiral?: boolean
}

function RotationMarker({ achiral, ...svgProps }: RotMarkerProps) {
  const size = 10
  const points: Point[] = [[0, size], [size, 0], achiral ? [-size, 0] : [0, 0]]
  return <Polygon {...svgProps} strokeWidth={2} points={points} />
}

interface Props {
  radius: number
  // true if the mino has four-fold rotational symmetry
  order: number
  // index of the hovered rotation
  hovered: number
  achiral: boolean
  color: string
}

/**
 * Displays arrows/markers representing the rotational symmetry of the mino.
 */
export default function RotationMarkers({
  radius,
  achiral,
  order,
  hovered,
  color,
}: Props) {
  // TODO display properly for diagonally reflective minos
  return (
    <g>
      {[0, 1, 2, 3].map((index) => {
        // Is the index visible?
        const shouldShow = index % (4 / order) === 0
        // Should this index be shown when hovered?
        const isHover = !!hovered && (index - hovered + 4) % (4 / order) === 0

        return (
          (shouldShow || isHover) && (
            <RotationMarker
              key={index}
              fill={isHover ? colors.highlight : color}
              achiral={achiral}
              transform={svgTransform()
                .translate(0, -radius)
                .rotate(90 * index)}
            />
          )
        )
      })}
    </g>
  )
}
