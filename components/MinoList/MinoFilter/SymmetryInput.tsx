import React, { ReactNode } from "react"
import { css } from "@emotion/react"
import { getSymmetryColor } from "components/graph"
import { Circle, Line } from "components/svg"

import { Polyomino, Symmetry, printSymmetry } from "mino"
import MinoDiv from "components/MinoDiv"
import InputTitle from "./InputTitle"
import { upsert, remove } from "./common"
import * as Tooltip from "@radix-ui/react-tooltip"
import { colors } from "style/theme"

// Choose a dimmer neutral color
const outlineColor = "#999"

// Common prop values for the symmetry lines
const markerProps = {
  stroke: outlineColor,
  strokeWidth: 1,
  fill: "none",
}

interface SymmetryType {
  // The type of symmetry
  type: Symmetry
  // The mino to display as the prototype for this symmetry
  mino: Polyomino
  // The symmetry markers to draw as a guide
  markers?: ReactNode
}

// Array of display information for the symmetry classes
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

interface Props {
  value?: Symmetry[]
  onUpdate(value: Symmetry[]): void
}

/**
 * Input to select what symmetries should be filtered out.
 */
export default function SymmetryInput({ value = [], onUpdate }: Props) {
  return (
    <div>
      <InputTitle display="Symmetries" onClear={() => onUpdate([])} />
      <div
        css={css`
          margin-top: 0.5rem;
          display: grid;
          grid-gap: 0.5rem 1rem;
          grid-template-areas:
            ".     all  ."
            "axis2 rot2 diag2"
            "axis  rot  diag"
            ".     none .";
        `}
      >
        {symmetryTypes.map(({ type: sym, mino, markers }) => {
          const checked = value.includes(sym)
          return (
            <Tooltip.Root key={sym}>
              <Tooltip.Trigger asChild>
                <label
                  css={css`
                    grid-area: ${sym};
                  `}
                >
                  {/* TODO (a11y) tab navigation */}
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={checked}
                    onChange={(e) =>
                      onUpdate(
                        e.target.checked
                          ? upsert(value, sym)
                          : remove(value, sym),
                      )
                    }
                  />
                  <MinoDiv
                    mino={mino}
                    fill={checked ? getSymmetryColor(sym) : "none"}
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
                  {printSymmetry(sym)}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          )
        })}
      </div>
    </div>
  )
}
