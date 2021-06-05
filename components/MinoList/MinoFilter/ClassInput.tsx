import React, { ReactNode } from "react"
import { css } from "@emotion/react"
import { getClassColor } from "components/graph"
import { Line, Polygon } from "components/svg"

import { Polyomino, MinoClass } from "mino"
import MinoDiv from "components/MinoDiv"
import InputTitle from "./InputTitle"

function upsert<T>(array: T[], value: T) {
  if (array.includes(value)) {
    return array
  }
  return [...array, value]
}

function remove<T>(array: T[], value: T) {
  const index = array.indexOf(value)
  if (index >= 0) {
    const result = [...array]
    result.splice(index, 1)
    return result
  }
  return array
}

// Choose a dimmer neutral color
const outlineColor = "#999"

// Common prop values for the symmetry lines
const symLinesProps = {
  stroke: outlineColor,
  strokeWidth: 1,
  fill: "none",
}

function ConvexMarker() {
  const r = 3
  return (
    <Polygon
      points={[
        [0, r],
        [r, 0],
        [0, -r],
        [-r, 0],
      ]}
      {...symLinesProps}
    />
  )
}

function SemiconvexMarker() {
  const r = 3
  return (
    <Polygon
      points={[
        [r, r],
        [-r, 0],
        [r, -r],
        [0, 0],
      ]}
      {...symLinesProps}
    />
  )
}

function DirectedMarker({
  anchor = "bottom left",
  x = 15,
  y = 15,
}: {
  anchor?: string
  x?: number
  y?: number
}) {
  const [vert, horiz] = anchor.split(" ")
  const ySign = vert === "top" ? -1 : 1
  const xSign = horiz === "left" ? -1 : 1
  return (
    <Line
      p1={[xSign * x, ySign * y]}
      p2={[xSign * (x - 5), ySign * (y - 5)]}
      {...symLinesProps}
    />
  )
}

interface ClassType {
  // The type of symmetry
  type: MinoClass
  // The mino to display as the prototype for this symmetry
  mino: Polyomino
  // The symmetry lines to draw as a guide
  lines?: ReactNode
}

// Array of display information for the symmetry classes
const classTypes: ClassType[] = [
  {
    type: "rectangle",
    mino: Polyomino.of("111_111"),
    lines: (
      <>
        <ConvexMarker />
        <DirectedMarker anchor="bottom left" x={10} />
        <DirectedMarker anchor="top left" x={10} />
        <DirectedMarker anchor="top right" x={10} />
        <DirectedMarker anchor="bottom right" x={10} />
      </>
    ),
  },
  {
    type: "Ferrers graph",
    mino: Polyomino.of("001_011_111"),
    lines: (
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
    lines: (
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
    lines: (
      <>
        <ConvexMarker />
        <DirectedMarker anchor="bottom left" />
        <DirectedMarker anchor="top left" />
      </>
    ),
  },
  {
    type: "directed convex",
    mino: Polyomino.of("010_011_110"),
    lines: (
      <>
        <ConvexMarker />
        <DirectedMarker />
      </>
    ),
  },
  {
    type: "bar graph",
    mino: Polyomino.of("001_101_111"),
    lines: (
      <>
        <SemiconvexMarker />
        <DirectedMarker anchor="bottom left" />
        <DirectedMarker anchor="top left" />
      </>
    ),
  },
  {
    type: "convex",
    mino: Polyomino.of("010_111_010"),
    lines: <ConvexMarker />,
  },
  {
    type: "directed semiconvex",
    mino: Polyomino.of("101_111_100"),
    lines: (
      <>
        <SemiconvexMarker />
        <DirectedMarker />
      </>
    ),
  },
  {
    type: "semiconvex",
    mino: Polyomino.of("101_111_010"),
    lines: <SemiconvexMarker />,
  },
  {
    type: "directed",
    mino: Polyomino.of("110_101_111"),
    lines: <DirectedMarker />,
  },
  { type: "other", mino: Polyomino.of("0011_1110_1011") },
]

// FIXME dedupe with classHelpers
const shortnames: Record<MinoClass, string> = {
  rectangle: "rect",
  "Ferrers graph": "ferr",
  staircase: "stair",
  stack: "stack",
  "directed convex": "dcvx",
  "bar graph": "bar",
  convex: "cvx",
  "directed semiconvex": "dscvx",
  semiconvex: "scvx",
  directed: "dir",
  other: "other",
}

interface Props {
  value?: MinoClass[]
  onUpdate(value: MinoClass[]): void
}

/**
 * Input to select what symmetries should be filtered out.
 */
export default function SymmetryInput({ value = [], onUpdate }: Props) {
  return (
    <div>
      <InputTitle display="Classes" onClear={() => onUpdate([])} />
      <div
        css={css`
          margin-top: 0.5rem;
          display: grid;
          grid-gap: 0.5rem 1rem;
          grid-template-areas:
            ".     .     rect"
            ".     stair ferr"
            "cvx   dcvx  stack"
            "scvx  dscvx bar"
            "other dir   .";
          justify-items: center;
        `}
      >
        {classTypes.map(({ type: cls, mino, lines }) => {
          const checked = value.includes(cls)
          return (
            <label
              key={cls}
              title={cls}
              css={css`
                grid-area: ${shortnames[cls]};
              `}
            >
              {/* TODO (a11y) tab navigation */}
              <input
                type="checkbox"
                className="visually-hidden"
                checked={checked}
                onChange={(e) =>
                  onUpdate(
                    e.target.checked ? upsert(value, cls) : remove(value, cls),
                  )
                }
              />
              <MinoDiv
                mino={mino}
                fill={checked ? getClassColor(cls) : "none"}
                stroke={outlineColor}
                size={30 / mino.height}
                gridStyle="none"
              >
                {lines}
              </MinoDiv>
            </label>
          )
        })}
      </div>
    </div>
  )
}
