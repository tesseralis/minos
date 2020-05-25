import React from "react"
import { Line, svgTransform } from "app/svg"
import { colors } from "style/theme"

interface Props {
  // The list of symmetries; a mapping of indices to booleans
  // with vertical symmetry being 0 and moving clockwise
  symmetries: boolean[]
  // The index of the reflection axis that should be highlighted
  hovered: number
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
  symmetries,
  hovered,
  color,
  ...lineProps
}: Props) {
  return (
    <g opacity={2 / 3}>
      {symmetries.map(
        (symmetry, i) =>
          (symmetry || i === hovered) && (
            <Line
              key={i}
              {...lineProps}
              p1={[-radius, 0]}
              p2={[radius, 0]}
              stroke={hovered === i ? colors.highlight : color}
              strokeWidth={hovered === i ? 4 : 2}
              transform={svgTransform().rotate(45 * i)}
            />
          ),
      )}
    </g>
  )
}
