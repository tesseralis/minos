import React from "react"
import { css } from "emotion"
import { colors } from "style/theme"
import { Line } from "app/svg"

const borderColor = "#aaa"

interface Props {
  radius: number
  innerRadius: number
}

export default function Background({ radius, innerRadius }: Props) {
  return (
    <g opacity={2 / 3}>
      <circle
        className={css`
          pointer-events: initial;
        `}
        cx={0}
        cy={0}
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
      <circle cx={-innerRadius} cy={0} r={3} fill={borderColor} />
      <circle cx={innerRadius} cy={0} r={3} fill={borderColor} />
    </g>
  )
}
