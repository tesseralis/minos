import React from "react"

import { Transform, hasSymmetry } from "mino"

import { Line, svgTransform } from "app/svg"
import { colors } from "style/theme"
import {
  innerRingRadius as radius,
  useSelected,
  useSelectedColor,
} from "./compassHelpers"

export const reflectionOrder = [
  "flipVert",
  "flipMainDiag",
  "flipHoriz",
  "flipMinorDiag",
] as const

interface Props {
  // The index of the reflection axis that should be highlighted
  hovered?: Transform
}

/**
 * Displays a line corresponding to the axes of the mino
 */
export default function ReflectionAxes({ hovered, ...lineProps }: Props) {
  const mino = useSelected()
  const color = useSelectedColor()
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
