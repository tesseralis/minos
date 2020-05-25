import React from "react"

import { Mino } from "mino/mino"
import { Transform, hasSymmetry } from "mino/transform"

import { Line, svgTransform } from "app/svg"
import { colors } from "style/theme"

export const reflectionOrder = [
  "flipVert",
  "flipMainDiag",
  "flipHoriz",
  "flipMinorDiag",
] as const

interface Props {
  // The list of symmetries; a mapping of indices to booleans
  // with vertical symmetry being 0 and moving clockwise
  mino: Mino
  // The index of the reflection axis that should be highlighted
  hovered?: Transform
  // Radius of the axes
  radius: number
  // Color of the axes
  color: string
}

/**
 * Displays a line corresponding to the axes of the mino
 */
export default function ReflectionAxes({
  radius,
  color,
  mino,
  hovered,
  ...lineProps
}: Props) {
  return (
    <g opacity={2 / 3}>
      {reflectionOrder.map((reflection, i) => {
        const isHovered = reflection === hovered
        return (
          (hasSymmetry(mino, reflection) || isHovered) && (
            <Line
              key={i}
              {...lineProps}
              p1={[-radius, 0]}
              p2={[radius, 0]}
              stroke={isHovered ? colors.highlight : color}
              strokeWidth={isHovered ? 4 : 2}
              transform={svgTransform().rotate(45 * i)}
            />
          )
        )
      })}
    </g>
  )
}
