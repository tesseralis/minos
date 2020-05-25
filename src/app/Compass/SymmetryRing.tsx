import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import type { Mino } from "mino/mino"
import { Transform, getSymmetry, hasSymmetry } from "mino/transform"
import { getSymmetryColor } from "app/graph"
import { colors } from "style/theme"

import RotationMarkers from "./RotationMarkers"
import ReflectionAxes from "./ReflectionAxes"
import TransformButtons, { reflectionOrder } from "./TransformButtons"

const rotationList = ["rotateHalf", "rotateLeft"] as const

interface Props {
  mino: Mino
  radius: number
  onHover?(hovered: boolean): void
  onSelect?(mino: Mino): void
}

const rotationHover: any = {
  rotateRight: 1,
  rotateHalf: 2,
  rotateLeft: 3,
}

/**
 * A ring that displays visual indicators for the symmetries of the mino
 */
export default function SymmetryRing({
  mino,
  radius,
  onHover,
  onSelect,
}: Props) {
  const [hovered, setHovered] = React.useState<Transform | undefined>()
  const color = getSymmetryColor(getSymmetry(mino))

  const reflections = reflectionOrder.map((t) => hasSymmetry(mino, t))
  const symmetric = reflections.some((t) => t)
  const rotationOrder =
    rotationList.filter((t) => hasSymmetry(mino, t)).length * 2 || 1

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
        radius={radius}
        symmetries={reflections}
        color={color}
        hovered={reflectionOrder.indexOf(hovered as any)}
      />
      <RotationMarkers
        radius={radius}
        color={color}
        achiral={symmetric}
        order={rotationOrder}
        hovered={rotationHover[hovered as any] ?? 0}
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
