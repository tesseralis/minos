import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import type { Mino } from "mino/mino"
import { Transform, getSymmetry } from "mino/transform"
import { getSymmetryColor } from "app/graph"
import { colors } from "style/theme"

import RotationMarkers from "./RotationMarkers"
import ReflectionAxes from "./ReflectionAxes"
import TransformButtons from "./TransformButtons"

interface Props {
  mino: Mino
  radius: number
  onHover?(hovered: boolean): void
  onSelect?(mino: Mino): void
}

/**
 * A ring that displays visual indicators for the symmetries of the mino
 * and buttons to be able to transform the mino into one of those symmetries.
 */
export default function SymmetryRing({
  mino,
  radius,
  onHover,
  onSelect,
}: Props) {
  const [hovered, setHovered] = React.useState<Transform | undefined>()
  const color = getSymmetryColor(getSymmetry(mino))

  return (
    <g opacity={2 / 3}>
      {/* Hide the strands behind the component */}
      <circle
        r={radius}
        fill={tinycolor.mix(color, colors.bg, 90).toString()}
        className={css`
          pointer-events: initial;
        `}
        onMouseOver={() => onHover?.(true)}
        onMouseOut={() => onHover?.(false)}
      />
      <ReflectionAxes
        mino={mino}
        hovered={hovered}
        radius={radius}
        color={color}
      />
      <RotationMarkers
        mino={mino}
        hovered={hovered}
        radius={radius}
        color={color}
      />
      <TransformButtons
        mino={mino}
        radius={radius + 5}
        color={color}
        onHover={setHovered}
        onSelect={onSelect}
      />
      <circle r={radius} fill="none" stroke={color} strokeWidth={3} />
    </g>
  )
}
