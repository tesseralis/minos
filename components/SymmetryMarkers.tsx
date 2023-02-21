import React from "react"
import { Polyomino } from "mino"
import { Circle, Line, SVGProps } from "./svg"

interface Props extends SVGProps<any> {
  mino: Polyomino
  // The size to a cell of the polyomino
  size: number
}

/**
 * Displays symmetry markers for a polyomino.
 */
export default function SymmetryMarkers({ mino, size, ...svgProps }: Props) {
  const [width, height] = mino.dims.map((dim) => dim * size)
  const overflow = size / 2
  const left = -width / 2 - overflow
  const right = width / 2 + overflow
  const top = -height / 2 - overflow
  const bottom = height / 2 + overflow

  const radius = Math.min(width, height) / 2 - overflow
  const circumference = 2 * Math.PI * radius
  const arrowTip = radius / 3

  const horizontalLine = <Line p1={[left, 0]} p2={[right, 0]} {...svgProps} />
  const verticalLine = <Line p1={[0, top]} p2={[0, bottom]} {...svgProps} />
  const mainDiagLine = (
    <Line p1={[left, bottom]} p2={[right, top]} {...svgProps} />
  )
  const minorDiagLine = (
    <Line p1={[left, top]} p2={[right, bottom]} {...svgProps} />
  )

  switch (mino.transform.symmetry()) {
    case "all": {
      return (
        <>
          {horizontalLine}
          {verticalLine}
          {mainDiagLine}
          {minorDiagLine}
        </>
      )
    }
    case "axis2": {
      return (
        <>
          {horizontalLine}
          {verticalLine}
        </>
      )
    }
    case "diag2": {
      return (
        <>
          {mainDiagLine}
          {minorDiagLine}
        </>
      )
    }
    case "rot2": {
      return (
        <>
          <Circle
            r={radius}
            {...svgProps}
            strokeDasharray={`${circumference / 8} ${circumference / 8}`}
            fill="none"
          />
          <Line
            {...svgProps}
            p1={[-radius, 0]}
            p2={[-radius - arrowTip / 2, -arrowTip / 2]}
            strokeLinecap="round"
          />
          <Line
            {...svgProps}
            p1={[radius, 0]}
            p2={[radius + arrowTip / 2, arrowTip / 2]}
            strokeLinecap="round"
          />
          <Line
            {...svgProps}
            p1={[0, -radius]}
            p2={[arrowTip / 2, -radius - arrowTip / 2]}
            strokeLinecap="round"
          />
          <Line
            {...svgProps}
            p1={[0, radius]}
            p2={[-arrowTip / 2, radius + arrowTip / 2]}
            strokeLinecap="round"
          />
        </>
      )
    }
    case "axis": {
      return mino.equals(mino.transform.apply("flipVert"))
        ? horizontalLine
        : verticalLine
    }
    case "diag": {
      return mino.equals(mino.transform.apply("flipMinorDiag"))
        ? mainDiagLine
        : minorDiagLine
    }
    case "rot": {
      return (
        <>
          <Circle
            r={radius}
            {...svgProps}
            strokeDasharray={`${circumference / 4} ${circumference / 4}`}
            fill="none"
            strokeLinecap="round"
          />
          <Line
            {...svgProps}
            p1={[-radius, 0]}
            p2={[-radius - arrowTip, -arrowTip]}
            strokeLinecap="round"
          />
          <Line
            {...svgProps}
            p1={[radius, 0]}
            p2={[radius + arrowTip, arrowTip]}
            strokeLinecap="round"
          />
        </>
      )
    }
    default: {
      return null
    }
  }
}
