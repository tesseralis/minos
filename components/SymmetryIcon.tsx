import { Polyomino, Symmetry } from "mino"
import React, { ReactNode } from "react"
import { Circle, Line } from "components/svg"
import MinoDiv from "./MinoDiv"

interface Props {
  symmetry: Symmetry
  fill: string
  stroke: string
  size: number
}

// Icon representing a particular symmetry class
export default function SymmetryIcon({ symmetry, fill, stroke, size }: Props) {
  // Common prop values for the symmetry lines
  const markerProps = {
    stroke,
    strokeWidth: 1,
    fill: "none",
  }

  const linePos = size / 2
  const radius = size / 3

  const symmetryTypes: SymmetryType[] = [
    {
      type: "all",
      mino: Polyomino.of("010_111_010"),
      markers: (
        <>
          <Line p1={[0, linePos]} p2={[0, -linePos]} {...markerProps} />
          <Line p1={[linePos, 0]} p2={[-linePos, 0]} {...markerProps} />
          <Line
            p1={[-linePos, linePos]}
            p2={[linePos, -linePos]}
            {...markerProps}
          />
          <Line
            p1={[-linePos, -linePos]}
            p2={[linePos, linePos]}
            {...markerProps}
          />
        </>
      ),
    },
    {
      type: "axis2",
      mino: Polyomino.of("101_111_101"),
      markers: (
        <>
          <Line p1={[0, linePos]} p2={[0, -linePos]} {...markerProps} />
          <Line p1={[linePos, 0]} p2={[-linePos, 0]} {...markerProps} />
        </>
      ),
    },
    {
      type: "diag2",
      mino: Polyomino.of("110_111_011"),
      markers: (
        <>
          <Line
            p1={[-linePos, linePos]}
            p2={[linePos, -linePos]}
            {...markerProps}
          />
          <Line
            p1={[-linePos, -linePos]}
            p2={[linePos, linePos]}
            {...markerProps}
          />
        </>
      ),
    },
    {
      type: "rot2",
      mino: Polyomino.of("0010_1110_0111_0100"),
      markers: <Circle r={radius} {...markerProps} />,
    },
    {
      type: "axis",
      mino: Polyomino.of("100_111_100"),
      markers: <Line p1={[0, linePos]} p2={[0, -linePos]} {...markerProps} />,
    },
    {
      type: "diag",
      mino: Polyomino.of("100_110_011"),
      markers: (
        <Line
          p1={[-linePos, linePos]}
          p2={[linePos, -linePos]}
          {...markerProps}
        />
      ),
    },
    {
      type: "rot",
      mino: Polyomino.of("001_111_100"),
      markers: <Circle r={radius} {...markerProps} />,
    },
    { type: "none", mino: Polyomino.of("010_110_011") },
  ]
  const { mino, markers } = symmetryTypes.find((s) => s.type === symmetry)!

  return (
    <MinoDiv
      mino={mino}
      fill={fill}
      stroke={stroke}
      size={size / mino.height}
      gridStyle="none"
    >
      {markers}
    </MinoDiv>
  )
}

interface SymmetryType {
  // The type of symmetry
  type: Symmetry
  // The mino to display as the prototype for this symmetry
  mino: Polyomino
  // The symmetry markers to draw as a guide
  markers?: ReactNode
}
