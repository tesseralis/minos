import { Polyomino, Symmetry } from "mino"
import React, { ReactNode } from "react"
import { Circle, Line } from "components/svg"
import MinoDiv from "./MinoDiv"

interface Props {
  symmetry: Symmetry
  fill: string
  stroke: string
}

// Icon representing a particular symmetry class
export default function SymmetryIcon({ symmetry, fill, stroke }: Props) {
  const { mino, markers } = symmetryTypes.find((s) => s.type === symmetry)!
  return (
    <MinoDiv
      mino={mino}
      fill={fill}
      stroke={stroke}
      size={30 / mino.height}
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

// Choose a dimmer neutral color
const outlineColor = "#999"

// Common prop values for the symmetry lines
const markerProps = {
  stroke: outlineColor,
  strokeWidth: 1,
  fill: "none",
}

const symmetryTypes: SymmetryType[] = [
  {
    type: "all",
    mino: Polyomino.of("010_111_010"),
    markers: (
      <>
        <Line p1={[0, 20]} p2={[0, -20]} {...markerProps} />
        <Line p1={[20, 0]} p2={[-20, 0]} {...markerProps} />
        <Line p1={[-20, 20]} p2={[20, -20]} {...markerProps} />
        <Line p1={[-20, -20]} p2={[20, 20]} {...markerProps} />
      </>
    ),
  },
  {
    type: "axis2",
    mino: Polyomino.of("101_111_101"),
    markers: (
      <>
        <Line p1={[0, 20]} p2={[0, -20]} {...markerProps} />
        <Line p1={[20, 0]} p2={[-20, 0]} {...markerProps} />
      </>
    ),
  },
  {
    type: "diag2",
    mino: Polyomino.of("110_111_011"),
    markers: (
      <>
        <Line p1={[-20, 20]} p2={[20, -20]} {...markerProps} />
        <Line p1={[-20, -20]} p2={[20, 20]} {...markerProps} />
      </>
    ),
  },
  {
    type: "rot2",
    mino: Polyomino.of("0010_1110_0111_0100"),
    markers: <Circle r={10} {...markerProps} />,
  },
  {
    type: "axis",
    mino: Polyomino.of("100_111_100"),
    markers: <Line p1={[0, 20]} p2={[0, -20]} {...markerProps} />,
  },
  {
    type: "diag",
    mino: Polyomino.of("100_110_011"),
    markers: <Line p1={[-20, 20]} p2={[20, -20]} {...markerProps} />,
  },
  {
    type: "rot",
    mino: Polyomino.of("001_111_100"),
    markers: <Circle r={10} {...markerProps} />,
  },
  { type: "none", mino: Polyomino.of("010_110_011") },
]
