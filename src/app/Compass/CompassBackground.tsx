import React from "react"
import { css } from "emotion"
import { colors } from "style/theme"
import { Circle, Line } from "app/svg"

const borderColor = "#aaa"

interface Props {
  radius: number
  innerRadius: number
}

export default function Background({ radius, innerRadius }: Props) {
  return (
    <g opacity={2 / 3}>
      <Circle
        className={css`
          pointer-events: initial;
        `}
        r={radius}
        fill={colors.bg}
        stroke={borderColor}
      />
      <Line
        p1={[-radius, 0]}
        p2={[-innerRadius, 0]}
        stroke={borderColor}
        strokeWidth={1}
      />
      <Line
        p1={[innerRadius, 0]}
        p2={[radius, 0]}
        stroke={borderColor}
        strokeWidth={1}
      />
      <Circle center={[-innerRadius, 0]} r={3} fill={borderColor} />
      <Circle center={[innerRadius, 0]} r={3} fill={borderColor} />
    </g>
  )
}
