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
      {...markerProps}
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
      {...markerProps}
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
      {...markerProps}
    />
  )
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
        <SemiconvexMarker />
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
    mino: Polyomino.of("101_111_100"),
    markers: (
      <>
        <SemiconvexMarker />
        <DirectedMarker />
      </>
    ),
  },
  {
    type: "semiconvex",
    mino: Polyomino.of("101_111_010"),
    markers: <SemiconvexMarker />,
  },
  {
    type: "directed",
    mino: Polyomino.of("110_101_111"),
    markers: <DirectedMarker />,
  },
  { type: "other", mino: Polyomino.of("0011_1110_1011") },
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
                    size={30 / mino.height}
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
