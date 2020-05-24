import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import type { Point } from "math"
import type { Mino } from "mino/mino"
import { transform, getSymmetry } from "mino/transform"
import { getSymmetryColor } from "./graph"
import { Line, Polygon, svgTransform } from "./utils"

interface Props {
  mino: Mino
  radius: number
  onHover?(hovered: boolean): void
}

interface RotMarkerProps extends React.SVGProps<SVGPolygonElement> {
  symmetric?: boolean
}

function RotationMarker({ symmetric, ...svgProps }: RotMarkerProps) {
  const size = 5
  const points: Point[] = [
    [0, -size],
    [size, 0],
    [0, size],
  ]
  if (symmetric) points.push([-size, 0])
  return <Polygon {...svgProps} strokeWidth={2} points={points} />
}

interface RotMarkersProps extends RotMarkerProps {
  radius: number
  double?: boolean
}

function RotationMarkers({
  radius,
  symmetric,
  double,
  ...svgProps
}: RotMarkersProps) {
  const indices = double ? [0, 1, 2, 3] : [0, 2]
  return (
    <g>
      {indices.map((index) => (
        <RotationMarker
          key={index}
          {...svgProps}
          symmetric={symmetric}
          transform={svgTransform()
            .translate(-1, radius)
            .rotate(90 * index)
            .toString()}
        />
      ))}
    </g>
  )
}

interface ReflectionAxesProps extends React.SVGProps<SVGLineElement> {
  radius: number
  symmetries: boolean[]
}

function ReflectionAxes({
  radius,
  symmetries,
  ...svgProps
}: ReflectionAxesProps) {
  return (
    <g>
      {symmetries.map(
        (symmetry, i) =>
          symmetry && (
            <Line
              key={i}
              {...svgProps}
              p1={[0, -radius]}
              p2={[0, radius]}
              transform={svgTransform()
                .rotate(45 * i)
                .toString()}
            />
          ),
      )}
    </g>
  )
}

const reflections = [
  "flipHoriz",
  "flipMinorDiag",
  "flipVert",
  "flipMainDiag",
] as const

/**
 * Displays the symmetry of the mino
 */
export default function SymmetryRing({ mino, radius, onHover }: Props) {
  const symmetry = getSymmetry(mino)
  const color = getSymmetryColor(symmetry)

  const reflectionMap = reflections.map((t) => mino === transform(mino, t))
  const symmetric = reflectionMap.some((t) => t)
  return (
    <g opacity={2 / 3}>
      <circle r={radius} fill="#222" />
      <circle
        r={radius}
        fill={tinycolor(color)
          .setAlpha(1 / 8)
          .toString()}
        stroke={color}
        strokeWidth={3}
        className={css`
          pointer-events: initial;
        `}
        onMouseOver={() => onHover?.(true)}
        onMouseOut={() => onHover?.(false)}
      />
      <ReflectionAxes
        radius={radius}
        symmetries={reflectionMap}
        stroke={color}
        strokeWidth={2}
      />
      {mino === transform(mino, "rotateHalf") && (
        <RotationMarkers
          radius={radius}
          stroke={color}
          fill={color}
          symmetric={symmetric}
          double={mino === transform(mino, "rotateLeft")}
        />
      )}
    </g>
  )
}
