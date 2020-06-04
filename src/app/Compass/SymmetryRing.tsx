import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import { Transform, getSymmetry } from "mino"
import { getSymmetryColor } from "app/graph"
import { Circle } from "app/svg"
import { colors } from "style/theme"

import RotationMarkers from "./RotationMarkers"
import ReflectionAxes from "./ReflectionAxes"
import TransformButtons from "./TransformButtons"
import { useSelected } from "app/SelectedContext"

interface Props {
  radius: number
  onHover?(hovered: boolean): void
}

/**
 * A ring that displays visual indicators for the symmetries of the mino
 * and buttons to be able to transform the mino into one of those symmetries.
 */
export default function SymmetryRing({ radius, onHover }: Props) {
  // FIXME useSymmetryColor set separately
  const mino = useSelected()
  const [hovered, setHovered] = React.useState<Transform | undefined>()
  if (!mino) return null
  const color = getSymmetryColor(getSymmetry(mino))

  return (
    <g opacity={2 / 3}>
      {/* Hide the strands behind the component */}
      <Circle
        className={css`
          pointer-events: initial;
        `}
        r={radius}
        fill={tinycolor.mix(color, colors.bg, 90)}
        onHover={onHover}
      />
      <ReflectionAxes hovered={hovered} radius={radius} color={color} />
      <RotationMarkers hovered={hovered} radius={radius} color={color} />
      <TransformButtons
        radius={radius + 5}
        color={color}
        onHover={setHovered}
      />
      <Circle r={radius} fill="none" stroke={color} strokeWidth={3} />
    </g>
  )
}
