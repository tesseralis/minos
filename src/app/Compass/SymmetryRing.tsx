import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import { Transform } from "mino"
import { Circle } from "app/svg"
import { colors } from "style/theme"

import RotationMarkers from "./RotationMarkers"
import ReflectionAxes from "./ReflectionAxes"
import TransformButtons from "./TransformButtons"
import { innerRingRadius as radius, useSelectedColor } from "./compassHelpers"

interface Props {
  onHover?(hovered: boolean): void
}

/**
 * A ring that displays visual indicators for the symmetries of the mino
 * and buttons to be able to transform the mino into one of those symmetries.
 */
export default function SymmetryRing({ onHover }: Props) {
  const color = useSelectedColor()
  const [hovered, setHovered] = React.useState<Transform | undefined>()

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
      <ReflectionAxes hovered={hovered} />
      <RotationMarkers hovered={hovered} />
      <TransformButtons onHover={setHovered} />
      <Circle r={radius} fill="none" stroke={color} strokeWidth={3} />
    </g>
  )
}
