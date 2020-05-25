import React from "react"
import { Line, svgTransform } from "app/svg"

interface ReflectionAxesProps {
  // Radius of the axes
  radius: number
  // The list of symmetries
  symmetries: boolean[]
  color: string
  hovered: number
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
}: ReflectionAxesProps) {
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
              stroke={hovered === i ? "white" : color}
              strokeWidth={hovered === i ? 4 : 2}
              transform={svgTransform().rotate(45 * i)}
            />
          ),
      )}
    </g>
  )
}
