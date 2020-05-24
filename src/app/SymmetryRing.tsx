import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import type { Point } from "math"
import type { Mino } from "mino/mino"
import { getSymmetry, hasSymmetry } from "mino/transform"
import { getSymmetryColor } from "./graph"
import { Line, LineProps, Polygon, PolygonProps, svgTransform } from "./svg"

interface RotMarkerProps extends Omit<PolygonProps, "points"> {
  // if true, render symmetric symbol
  achiral?: boolean
}

function RotationMarker({ achiral, ...svgProps }: RotMarkerProps) {
  const size = 5
  const points: Point[] = [
    [0, -size],
    [size, 0],
    [0, size],
  ]
  if (achiral) points.push([-size, 0])
  return <Polygon {...svgProps} strokeWidth={2} points={points} />
}

interface RotMarkersProps extends RotMarkerProps {
  radius: number
  // true if the mino has four-fold rotational symmetry
  order: number
}

/**
 * Displays arrows or lozenges representing the rotational symmetry of the mino.
 */
function RotationMarkers({
  radius,
  achiral,
  order,
  ...svgProps
}: RotMarkersProps) {
  const indices = order === 4 ? [0, 1, 2, 3] : order === 2 ? [0, 2] : []
  return (
    <g>
      {indices.map((index) => (
        <RotationMarker
          key={index}
          {...svgProps}
          achiral={achiral}
          transform={svgTransform()
            .translate(-1, radius)
            .rotate(90 * index)}
        />
      ))}
    </g>
  )
}

interface ReflectionAxesProps extends Omit<LineProps, "p1" | "p2"> {
  // Radius of the axes
  radius: number
  // The list of symmetries
  symmetries: boolean[]
}

/**
 * Displays a line corresponding to the axes of the mino
 */
function ReflectionAxes({
  radius,
  symmetries,
  ...lineProps
}: ReflectionAxesProps) {
  return (
    <g>
      {symmetries.map(
        (symmetry, i) =>
          symmetry && (
            <Line
              key={i}
              {...lineProps}
              p1={[0, -radius]}
              p2={[0, radius]}
              transform={svgTransform().rotate(45 * i)}
            />
          ),
      )}
    </g>
  )
}

const reflectionList = [
  "flipHoriz",
  "flipMinorDiag",
  "flipVert",
  "flipMainDiag",
] as const

const rotationList = ["rotateHalf", "rotateLeft"] as const

interface Props {
  mino: Mino
  radius: number
  onHover?(hovered: boolean): void
}

/**
 * A ring that displays visual indicators for the symmetries of the mino
 */
export default function SymmetryRing({ mino, radius, onHover }: Props) {
  const color = getSymmetryColor(getSymmetry(mino))

  const reflections = reflectionList.map((t) => hasSymmetry(mino, t))
  const symmetric = reflections.some((t) => t)
  const rotationOrder =
    rotationList.filter((t) => hasSymmetry(mino, t)).length * 2

  return (
    <g opacity={2 / 3}>
      {/* Hide the strands behind us */}
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
        symmetries={reflections}
        stroke={color}
        strokeWidth={2}
      />
      <RotationMarkers
        radius={radius}
        stroke={color}
        fill={color}
        achiral={symmetric}
        order={rotationOrder}
      />
    </g>
  )
}
