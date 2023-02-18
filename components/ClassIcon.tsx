import { MinoClass, Polyomino } from "mino"
import React, { ReactNode } from "react"
import MinoDiv from "./MinoDiv"
import { Circle, Line } from "./svg"

interface Props {
  class: MinoClass
  size: number
  fill: string
  stroke: string
}
export default function ClassIcon({ class: cls, size, fill, stroke }: Props) {
  interface ClassType {
    // The type of symmetry
    type: MinoClass
    // The mino to display as the prototype for this symmetry
    mino: Polyomino
    // The symmetry lines to draw as a guide
    markers?: ReactNode
  }
  const markerProps = {
    stroke,
    strokeWidth: 1,
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
      mino: Polyomino.of("110_101_111_010"),
      markers: (
        <>
          <SemiDirectedMarker anchor="bottom" xOffset={-size / 8} />
          <SemiDirectedMarker anchor="left" xOffset={-size / 8} />
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
      mino: Polyomino.of("110_101_111_101"),
      markers: <SemiDirectedMarker xOffset={-size / 8} />,
    },
    { type: "other", mino: Polyomino.of("01111_10101_11110") },
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
  }: {
    anchor?: string
    xOffset?: number
  }) {
    const offset = size / 4
    if (anchor === "top" || anchor === "bottom") {
      const ySign = anchor === "top" ? 1 : -1
      const radius = size / 15
      return (
        <>
          <Circle
            center={[xOffset, 0]}
            r={radius}
            {...markerProps}
            fill={stroke}
          />
          <Line
            p1={[xOffset, 0]}
            p2={[xOffset, ySign * offset]}
            {...markerProps}
          />
        </>
      )
    } else {
      const xSign = anchor === "left" ? 1 : -1
      return (
        <>
          <Circle center={[xOffset, 0]} r={1} {...markerProps} fill={stroke} />
          <Line
            p1={[xOffset, 0]}
            p2={[xOffset + xSign * offset, 0]}
            {...markerProps}
          />
        </>
      )
    }
  }

  const { mino, markers } = classTypes.find((c) => c.type === cls)!

  return (
    <MinoDiv
      mino={mino}
      fill={fill}
      stroke={stroke}
      size={size / Math.max(mino.height, mino.width)}
      gridStyle="none"
    >
      {markers}
    </MinoDiv>
  )
}
