import React, { ReactNode } from "react"
import { css } from "@emotion/react"
import { getClassColor } from "components/graph"
import { Line, Polygon } from "components/svg"

import { Polyomino, MinoClass, getClassCode } from "mino"
import MinoDiv from "components/MinoDiv"
import InputTitle from "./InputTitle"
import { upsert, remove } from "./common"
import * as Tooltip from "@radix-ui/react-tooltip"
import { colors } from "style/theme"

// Choose a dimmer neutral color
const outlineColor = "#999"

// Common prop values for the markers
const markerProps = {
  stroke: outlineColor,
  strokeWidth: 1,
  fill: "none",
}

interface ClassType {
  // The type of symmetry
  type: MinoClass
  // The mino to display as the prototype for this symmetry
  mino: Polyomino
  // The symmetry lines to draw as a guide
  markers?: ReactNode
}

// Array of display information for the symmetry classes
const classTypes: ClassType[] = [
  {
    type: "rectangle",
    mino: Polyomino.of("111_111"),
    markers: (
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
    type: "directed convex",
    mino: Polyomino.of("010_011_110"),
    markers: (
      <>
        <ConvexMarker />
        <DirectedMarker />
      </>
    ),
  },
  {
    type: "bar graph",
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
    type: "convex",
    mino: Polyomino.of("010_111_010"),
    markers: <ConvexMarker />,
  },
  {
    type: "directed semiconvex",
    mino: Polyomino.of("101_111_110"),
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
    type: "directed",
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
    type: "predirected",
    mino: Polyomino.of("110_101_111_010"),
    markers: (
      <>
        <SemiDirectedMarker anchor="bottom" y={12} />
        <SemiDirectedMarker anchor="left" />
      </>
    ),
  },
  {
    type: "semiconvex",
    mino: Polyomino.of("101_111_101"),
    markers: (
      <>
        <SemiDirectedMarker anchor="bottom" />
        <SemiDirectedMarker anchor="top" />
      </>
    ),
  },
  {
    type: "semidirected",
    mino: Polyomino.of("110_101_111_101"),
    markers: <SemiDirectedMarker y={12} />,
  },
  { type: "other", mino: Polyomino.of("01111_10101_11110") },
]

interface Props {
  value?: MinoClass[]
  onUpdate(value: MinoClass[]): void
}

/**
 * Input to select what symmetries should be filtered out.
 */
export default function ClassInput({ value = [], onUpdate }: Props) {
  return (
    <div>
      <InputTitle display="Classes" onClear={() => onUpdate([])} />
      <div
        css={css`
          margin-top: 0.5rem;
          display: grid;
          grid-gap: 1rem 0.75rem;
          grid-template-areas:
            ".     .    rect  ."
            ".     ferr rect  ."
            "stair ferr stack ."
            "stair dcvx stack bar"
            "cvx   dcvx dscvx bar"
            "cvx   cres dscvx dir"
            "scvx  cres pdir  dir"
            "scvx  sdir pdir  ."
            ".     sdir other ."
            ".     .    other .";
          justify-items: center;
        `}
      >
        {classTypes.map(({ type: cls, mino, markers }) => {
          const checked = value.includes(cls)
          return (
            <Tooltip.Root key={cls}>
              <Tooltip.Trigger asChild>
                <label
                  css={css`
                    grid-area: ${getClassCode(cls)};
                  `}
                >
                  {/* TODO maybe use the Radix toggle group instead? */}
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={checked}
                    onChange={(e) =>
                      onUpdate(
                        e.target.checked
                          ? upsert(value, cls)
                          : remove(value, cls),
                      )
                    }
                  />
                  <MinoDiv
                    mino={mino}
                    fill={checked ? getClassColor(cls) : "none"}
                    stroke={outlineColor}
                    size={30 / Math.max(mino.height, mino.width)}
                    gridStyle="none"
                  >
                    {markers}
                  </MinoDiv>
                </label>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  css={css`
                    background: ${colors.bg};
                    border: 1px solid ${outlineColor};
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.5rem;
                  `}
                >
                  {cls}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )
        })}
      </div>
    </div>
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
      {...markerProps}
    />
  )
}

function ConvexMarker() {
  const r = 3
  return (
    <>
      <Line p1={[0, r]} p2={[0, -r]} {...markerProps} />
      <Line p1={[r, 0]} p2={[-r, 0]} {...markerProps} />
    </>
  )
}

function SemiDirectedMarker({
  anchor = "bottom",
  x = 15,
  y = 15,
}: {
  anchor?: string
  x?: number
  y?: number
}) {
  if (anchor === "top" || anchor === "bottom") {
    const ySign = anchor === "top" ? -1 : 1
    return (
      <Line p1={[0, ySign * y]} p2={[0, ySign * (y - 5)]} {...markerProps} />
    )
  } else {
    const xSign = anchor === "left" ? -1 : 1
    return (
      <Line p1={[xSign * x, 0]} p2={[xSign * (x - 5), 0]} {...markerProps} />
    )
  }
}
