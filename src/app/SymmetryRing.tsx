import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import type { Point } from "math"
import type { Mino } from "mino/mino"
import { Transform, getSymmetry, hasSymmetry, transform } from "mino/transform"
import { getSymmetryColor } from "./graph"
import { Line, LineProps, Polygon, PolygonProps, svgTransform } from "./svg"

interface RotMarkerProps extends Omit<PolygonProps, "points"> {
  // if true, render symmetric symbol
  achiral?: boolean
}

function RotationMarker({ achiral, ...svgProps }: RotMarkerProps) {
  const size = 10
  const points: Point[] = [[0, size], [size, 0], achiral ? [-size, 0] : [0, 0]]
  return <Polygon {...svgProps} strokeWidth={2} points={points} />
}

interface RotMarkersProps extends RotMarkerProps {
  radius: number
  // true if the mino has four-fold rotational symmetry
  order: number
  // index of the hovered rotation
  hovered: number
  color: string
}

/**
 * Displays arrows or lozenges representing the rotational symmetry of the mino.
 */
function RotationMarkers({
  radius,
  achiral,
  order,
  hovered,
  color,
  ...svgProps
}: RotMarkersProps) {
  // TODO display properly for diagonally reflective minos
  return (
    <g>
      {[0, 1, 2, 3].map((index) => {
        const shouldShow = index % (4 / order) === 0
        const isHover = !!hovered && (index - hovered + 4) % (4 / order) === 0

        return (
          (shouldShow || isHover) && (
            <RotationMarker
              key={index}
              {...svgProps}
              fill={isHover ? "white" : color}
              achiral={achiral}
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

interface ReflectionAxesProps extends Omit<LineProps, "p1" | "p2"> {
  // Radius of the axes
  radius: number
  // The list of symmetries
  symmetries: boolean[]
  hovered: number
}

/**
 * Displays a line corresponding to the axes of the mino
 */
function ReflectionAxes({
  radius,
  symmetries,
  hovered,
  stroke,
  ...lineProps
}: ReflectionAxesProps) {
  return (
    <g opacity={2 / 3}>
      {symmetries.map(
        (symmetry, i) =>
          (symmetry || i === hovered) && (
            <Line
              key={i}
              {...lineProps}
              p1={[-radius, 0]}
              p2={[radius, 0]}
              stroke={hovered === i ? "white" : stroke}
              strokeWidth={hovered === i ? 4 : 2}
              transform={svgTransform().rotate(45 * i)}
            />
          ),
      )}
    </g>
  )
}

const reflectionList = [
  "flipVert",
  "flipMainDiag",
  "flipHoriz",
  "flipMinorDiag",
] as const

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

// TODO replace these icons with actual SVG
const rotationSymbols: any = {
  rotateRight: "⃕",
  rotateHalf: "↻",
  rotateLeft: "⃔",
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

  const reflections = reflectionList.map((t) => hasSymmetry(mino, t))
  const symmetric = reflections.some((t) => t)
  const rotationOrder =
    rotationList.filter((t) => hasSymmetry(mino, t)).length * 2 || 1

  return (
    <g opacity={2 / 3}>
      {/* Hide the strands behind us */}
      <circle
        r={radius}
        fill={tinycolor.mix(color, "#222", 90).toString()}
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
        hovered={reflectionList.indexOf(hovered as any)}
      />
      <RotationMarkers
        radius={radius}
        color={color}
        achiral={symmetric}
        order={rotationOrder}
        hovered={rotationHover[hovered as any] ?? 0}
      />
      <g>
        {reflectionList.map((t, i) => (
          <text
            className={css`
              cursor: pointer;
              fill: ${color};
              pointer-events: initial;
              dominant-baseline: middle;
              :hover {
                fill: white;
              }
            `}
            key={t}
            onClick={() => onSelect?.(transform(mino, t))}
            onMouseOver={() => setHovered(t)}
            onMouseOut={() => setHovered(undefined)}
            transform={svgTransform()
              .translate(radius + 5, 0)
              .rotate(45 * i)
              .toString()}
          >
            ↕︎
          </text>
        ))}
        {(["rotateLeft", "rotateHalf", "rotateRight"] as const).map((t, i) => (
          <text
            key={t}
            className={css`
              fill: ${color};
              cursor: pointer;
              font-size: 20px;
              pointer-events: initial;
              text-anchor: middle;
              /* TODO this is sketchy -- browser support is unknown */
              dominant-baseline: ${t === "rotateHalf" ? "initial" : "middle"};
              :hover {
                fill: white;
              }
            `}
            onClick={() => onSelect?.(transform(mino, t as any))}
            onMouseOver={() => setHovered(t)}
            onMouseOut={() => setHovered(undefined)}
            transform={svgTransform()
              .translate(0, -(radius + 5))
              .rotate(30 * (i - 1))
              .toString()}
          >
            {rotationSymbols[t]}
          </text>
        ))}
        <circle r={radius} fill="none" stroke={color} strokeWidth={3} />
      </g>
    </g>
  )
}
