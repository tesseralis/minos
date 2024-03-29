import { css } from "@emotion/react"
import tinycolor from "tinycolor2"

import { Circle } from "components/svg"
import { colors } from "style/theme"

import RotationMarkers from "./RotationMarkers"
import ReflectionAxes from "./ReflectionAxes"
import TransformButtons from "./TransformButtons"
import { innerRingRadius as radius, useSelectedColor } from "./compassHelpers"

interface Props {
  showTransforms: boolean
}

/**
 * A ring that displays visual indicators for the symmetries of the mino
 * and buttons to be able to transform the mino into one of those symmetries.
 */
export default function SymmetryRing({ showTransforms }: Props) {
  const color = useSelectedColor()

  return (
    <g opacity={2 / 3}>
      {/* Hide the strands behind the component */}
      <Circle
        css={css`
          pointer-events: initial;
        `}
        r={radius}
        fill={tinycolor.mix(color, colors.bg, 90)}
      />
      <ReflectionAxes />
      <RotationMarkers />
      <TransformButtons visible={true || showTransforms} />
      <Circle r={radius} fill="none" stroke={color} strokeWidth={3} />
    </g>
  )
}
