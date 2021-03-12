import React from "react"
import { css } from "emotion"
import { colors } from "style/theme"
import { Circle, Line } from "app/svg"

import { outerRingRadius, halfRadius } from "./compassHelpers"
import Vector from "vector"

const borderColor = "#aaa"

export default function Background() {
  return (
    <g opacity={2 / 3}>
      <Circle
        className={css`
          pointer-events: initial;
        `}
        r={outerRingRadius}
        fill={colors.bg}
        stroke={borderColor}
      />
      <Line
        p1={new Vector(-outerRingRadius, 0)}
        p2={new Vector(-halfRadius, 0)}
        stroke={borderColor}
        strokeWidth={1}
      />
      <Line
        p1={new Vector(halfRadius, 0)}
        p2={new Vector(outerRingRadius, 0)}
        stroke={borderColor}
        strokeWidth={1}
      />
      <Circle center={new Vector(-halfRadius, 0)} r={3} fill={borderColor} />
      <Circle center={new Vector(halfRadius, 0)} r={3} fill={borderColor} />
    </g>
  )
}
