import React from "react"
import { css } from "@emotion/react"
import { colors } from "style/theme"
import { Circle, Line } from "app/svg"

import { outerRingRadius, halfRadius } from "./compassHelpers"

const borderColor = "#aaa"

export default function Background() {
  return (
    <g opacity={2 / 3}>
      <Circle
        css={css`
          pointer-events: initial;
        `}
        r={outerRingRadius}
        fill={colors.bg}
        stroke={borderColor}
      />
      <Line
        p1={[-outerRingRadius, 0]}
        p2={[-halfRadius, 0]}
        stroke={borderColor}
        strokeWidth={1}
      />
      <Line
        p1={[halfRadius, 0]}
        p2={[outerRingRadius, 0]}
        stroke={borderColor}
        strokeWidth={1}
      />
      <Circle center={[-halfRadius, 0]} r={3} fill={borderColor} />
      <Circle center={[halfRadius, 0]} r={3} fill={borderColor} />
    </g>
  )
}
