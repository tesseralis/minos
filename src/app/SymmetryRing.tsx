import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import type { Mino } from "mino/mino"
import { transform, getSymmetry } from "mino/transform"
import { getSymmetryColor } from "./graph"

interface Props {
  mino: Mino
  radius: number
  onHover?(hovered: boolean): void
}

interface RotMarkerProps extends React.SVGProps<SVGPolygonElement> {
  double?: boolean
}

function RotationMarker({ double, ...svgProps }: RotMarkerProps) {
  const size = 5
  const points = double
    ? `0 -${size} ${size} 0 0 ${size} -${size} 0`
    : `0 -${size} ${size} 0 0 ${size}`
  return <polygon {...svgProps} strokeWidth={2} points={points} />
}

/**
 * Displays the symmetry of the mino
 */
export default function SymmetryRing({ mino, radius, onHover }: Props) {
  const symmetry = getSymmetry(mino)
  const color = getSymmetryColor(symmetry)

  const h = radius / Math.sqrt(2)
  const horiz = mino === transform(mino, "flipHoriz")
  const vert = mino === transform(mino, "flipVert")
  const mainDiag = mino === transform(mino, "flipMainDiag")
  const minorDiag = mino === transform(mino, "flipMinorDiag")
  const doubleRot = horiz || vert || mainDiag || minorDiag
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
      {horiz && (
        <line
          x1={0}
          y1={radius}
          x2={0}
          y2={-radius}
          stroke={color}
          strokeWidth={2}
        />
      )}
      {vert && (
        <line
          x1={radius}
          y1={0}
          x2={-radius}
          y2={0}
          stroke={color}
          strokeWidth={2}
        />
      )}
      {mainDiag && (
        <line x1={-h} y1={-h} x2={h} y2={h} stroke={color} strokeWidth={2} />
      )}
      {minorDiag && (
        <line x1={h} y1={-h} x2={-h} y2={h} stroke={color} strokeWidth={2} />
      )}
      {mino === transform(mino, "rotateHalf") && (
        <g>
          <RotationMarker
            transform={`translate(0 ${-radius})`}
            stroke={color}
            fill={color}
            double={doubleRot}
          />
          <RotationMarker
            transform={`translate(0 ${radius}) rotate(180)`}
            stroke={color}
            fill={color}
            double={doubleRot}
          />
        </g>
      )}
      {mino === transform(mino, "rotateLeft") && (
        <g>
          <RotationMarker
            transform={`translate(${radius} 0) rotate(90)`}
            stroke={color}
            fill={color}
            double={doubleRot}
          />
          <RotationMarker
            transform={`translate(${-radius} 0) rotate(270)`}
            stroke={color}
            fill={color}
            double={doubleRot}
          />
        </g>
      )}
    </g>
  )
}
