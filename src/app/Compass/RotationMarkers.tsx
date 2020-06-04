import React from "react"

import { Transform, hasSymmetry, isOneSided } from "mino"

import { Point, Polygon, PolygonProps, svgTransform } from "app/svg"
import { colors } from "style/theme"
import {
  innerRingRadius as radius,
  useSelected,
  useSelectedColor,
} from "./compassHelpers"

interface RotMarkerProps extends Omit<PolygonProps, "points"> {
  // if true, render asymmetric symbol
  chiral?: boolean
}

function RotationMarker({ chiral, ...svgProps }: RotMarkerProps) {
  const size = 10
  const points: Point[] = [[0, size], [size, 0], chiral ? [0, 0] : [-size, 0]]
  return <Polygon {...svgProps} strokeWidth={2} points={points} />
}

const rotationList = [
  "identity",
  "rotateRight",
  "rotateHalf",
  "rotateLeft",
] as const

const rotationHover = new Map<string, number>(
  rotationList.map((t, i) => [t, i]),
)

interface Props {
  // current hovered transformation
  hovered?: Transform
}

/**
 * Displays arrows/markers representing the rotational symmetry of the mino.
 */
export default function RotationMarkers({ hovered }: Props) {
  const mino = useSelected()
  const color = useSelectedColor()
  const order = rotationList.filter((t) => hasSymmetry(mino, t)).length
  // TODO display properly for diagonally reflective minos
  const hoverIndex = hovered ? rotationHover.get(hovered)! : 0
  return (
    <g>
      {[0, 1, 2, 3].map((index) => {
        // Whether the index is visible
        const shouldShow = index % (4 / order) === 0
        // Whether the index is hovered or not
        const isHover =
          !!hovered && (index - hoverIndex + 4) % (4 / order) === 0

        return (
          (shouldShow || isHover) && (
            <RotationMarker
              key={index}
              fill={isHover ? colors.highlight : color}
              chiral={isOneSided(mino)}
              transform={svgTransform()
                .translate(0, -radius)
                .rotate(90 * index)}
            />
          )
        )
      })}
    </g>
  )
}
