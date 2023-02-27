import { DirClass, Polyomino } from "mino"
import React, { ReactNode } from "react"
import tinycolor from "tinycolor2"
import MinoDiv from "./MinoDiv"
import { Circle, Line } from "./svg"

interface Props {
  class: DirClass
  size: number
  fill: string
  stroke: string
}
export default function ClassIcon({ class: cls, size, fill, stroke }: Props) {
  interface ClassType {
    // The type of symmetry
    type: string
    // The mino to display as the prototype for this symmetry
    mino: Polyomino
    // The symmetry lines to draw as a guide
    markers?: ReactNode
  }
  const markerProps = {
    stroke,
    strokeWidth: 2,
    fill: "none",
  }

  // Array of display information for the symmetry classes
  const classTypes: ClassType[] = [
    {
      type: "rectangle",
      mino: Polyomino.of("111_111"),
      markers: (
        <>
          <ConvexMarker />
          <DirectedMarker anchor="bottom left" x={size / 3} />
          <DirectedMarker anchor="top left" x={size / 3} />
          <DirectedMarker anchor="top right" x={size / 3} />
          <DirectedMarker anchor="bottom right" x={size / 3} />
        </>
      ),
    },
    {
      type: "Ferrers diagram",
      mino: Polyomino.of("001_011_111"),
      markers: (
        <>
          <ConvexMarker />
          <DirectedMarker anchor="bottom left" />
          <DirectedMarker anchor="top left" />
          <DirectedMarker anchor="top right" />
        </>
      ),
    },
    {
      type: "staircase",
      mino: Polyomino.of("001_011_110"),
      markers: (
        <>
          <ConvexMarker />
          <DirectedMarker anchor="bottom left" />
          <DirectedMarker anchor="top right" />
        </>
      ),
    },
    {
      type: "stack",
      mino: Polyomino.of("010_011_111"),
      markers: (
        <>
          <ConvexMarker />
          <DirectedMarker anchor="bottom left" />
          <DirectedMarker anchor="top left" />
        </>
      ),
    },
    {
      type: "fork",
      mino: Polyomino.of("010_011_110"),
      markers: (
        <>
          <ConvexMarker />
          <DirectedMarker />
        </>
      ),
    },
    {
      type: "bar chart",
      mino: Polyomino.of("001_101_111"),
      markers: (
        <>
          <SemiDirectedMarker anchor="bottom" />
          <SemiDirectedMarker anchor="top" />
          <SemiDirectedMarker anchor="left" />
          <DirectedMarker anchor="bottom left" />
          <DirectedMarker anchor="top left" />
        </>
      ),
    },
    {
      type: "cross",
      mino: Polyomino.of("010_111_010"),
      markers: <ConvexMarker />,
    },
    {
      type: "wing",
      mino: Polyomino.of("101_111_100"),
      markers: (
        <>
          <DirectedMarker />
          <SemiDirectedMarker anchor="bottom" />
          <SemiDirectedMarker anchor="top" />
          <SemiDirectedMarker anchor="left" />
        </>
      ),
    },
    {
      type: "crescent",
      mino: Polyomino.of("101_111_010"),
      markers: (
        <>
          <SemiDirectedMarker anchor="bottom" />
          <SemiDirectedMarker anchor="top" />
          <SemiDirectedMarker anchor="left" />
        </>
      ),
    },
    {
      type: "antler",
      mino: Polyomino.of("110_101_111"),
      markers: (
        <>
          <DirectedMarker />
          <SemiDirectedMarker anchor="bottom" />
          <SemiDirectedMarker anchor="left" />
        </>
      ),
    },
    {
      type: "bent tree",
      mino: Polyomino.of("1011_1110_0011"),
      markers: (
        <>
          <SemiDirectedMarker anchor="bottom" yOffset={7.5} />
          <SemiDirectedMarker anchor="left" yOffset={7.5} />
        </>
      ),
    },
    {
      type: "range chart",
      mino: Polyomino.of("101_111_101"),
      markers: (
        <>
          <SemiDirectedMarker anchor="bottom" />
          <SemiDirectedMarker anchor="top" />
        </>
      ),
    },
    {
      type: "tree",
      mino: Polyomino.of("1011_1110_1011"),
      markers: <SemiDirectedMarker yOffset={7.5} />,
    },
    { type: "other", mino: Polyomino.of("11011_01110_11011") },
  ]

  function DirectedMarker({
    anchor = "bottom left",
    x = size / 2,
    y = size / 2,
  }: {
    anchor?: string
    x?: number
    y?: number
  }) {
    const offset = size / 6
    const [vert, horiz] = anchor.split(" ")
    const ySign = vert === "top" ? -1 : 1
    const xSign = horiz === "left" ? -1 : 1
    return (
      <Line
        p1={[xSign * x, ySign * y]}
        p2={[xSign * (x - offset), ySign * (y - offset)]}
        {...markerProps}
      />
    )
  }

  function ConvexMarker() {
    return (
      <>
        <SemiDirectedMarker anchor="bottom" />
        <SemiDirectedMarker anchor="left" />
        <SemiDirectedMarker anchor="right" />
        <SemiDirectedMarker anchor="top" />
      </>
    )
  }

  function SemiDirectedMarker({
    anchor = "bottom",
    xOffset = 0,
    yOffset = 0,
  }: {
    anchor?: string
    xOffset?: number
    yOffset?: number
  }) {
    const offset = size / 4
    if (anchor === "top" || anchor === "bottom") {
      const ySign = anchor === "top" ? 1 : -1
      const radius = size / 15
      return (
        <>
          <Circle
            center={[xOffset, yOffset]}
            r={radius}
            {...markerProps}
            fill={stroke}
          />
          <Line
            p1={[xOffset, yOffset]}
            p2={[xOffset, yOffset + ySign * offset]}
            {...markerProps}
          />
        </>
      )
    } else {
      const xSign = anchor === "left" ? 1 : -1
      return (
        <>
          <Circle
            center={[xOffset, yOffset]}
            r={1}
            {...markerProps}
            fill={stroke}
          />
          <Line
            p1={[xOffset, yOffset]}
            p2={[xOffset + xSign * offset, yOffset]}
            {...markerProps}
          />
        </>
      )
    }
  }

  const { mino, markers } = classTypes.find((c) => c.type === cls.name())!

  return (
    <MinoDiv
      mino={mino}
      fill={fill}
      stroke={tinycolor(stroke).setAlpha(0.75).toString()}
      strokeWidth={1}
      size={size / Math.max(mino.height, mino.width)}
      gridStyle="none"
    >
      {markers}
    </MinoDiv>
  )
}
