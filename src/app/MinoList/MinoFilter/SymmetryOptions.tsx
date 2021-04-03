import React, { ReactNode } from "react"
import { css } from "@emotion/css"
import { baseColorMap } from "app/graph"
import { Circle, Line } from "app/svg"

import { Polyomino, Symmetry } from "mino"
import MinoDiv from "app/MinoList/MinoDiv"
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

interface SymmetryType {
  type: Symmetry
  mino: Polyomino
  lines?: ReactNode
}

// Choose a dimmer neutral color
const outlineColor = "#999"

// Common prop values for the symmetry lines
const symLinesProps = {
  stroke: outlineColor,
  strokeWidth: 1,
  fill: "none",
}

const symSections: SymmetryType[] = [
  { type: "none", mino: Polyomino.of("010_110_011") },
  {
    type: "reflectOrtho",
    mino: Polyomino.of("100_111_100"),
    lines: <Line p1={[0, 20]} p2={[0, -20]} {...symLinesProps} />,
  },
  {
    type: "reflectDiag",
    mino: Polyomino.of("100_110_011"),
    lines: <Line p1={[-20, 20]} p2={[20, -20]} {...symLinesProps} />,
  },
  {
    type: "rotate2",
    mino: Polyomino.of("001_111_100"),
    lines: <Circle r={10} {...symLinesProps} />,
  },
  {
    type: "dihedralOrtho",
    mino: Polyomino.of("101_111_101"),
    lines: (
      <>
        <Line p1={[0, 20]} p2={[0, -20]} {...symLinesProps} />
        <Line p1={[20, 0]} p2={[-20, 0]} {...symLinesProps} />
      </>
    ),
  },
  {
    type: "dihedralDiag",
    mino: Polyomino.of("110_111_011"),
    lines: (
      <>
        <Line p1={[-20, 20]} p2={[20, -20]} {...symLinesProps} />
        <Line p1={[-20, -20]} p2={[20, 20]} {...symLinesProps} />
      </>
    ),
  },
  {
    type: "rotate4",
    mino: Polyomino.of("0010_1110_0111_0100"),
    lines: <Circle r={10} {...symLinesProps} />,
  },
  {
    type: "all",
    mino: Polyomino.of("010_111_010"),
    lines: (
      <>
        <Line p1={[0, 20]} p2={[0, -20]} {...symLinesProps} />
        <Line p1={[20, 0]} p2={[-20, 0]} {...symLinesProps} />
        <Line p1={[-20, 20]} p2={[20, -20]} {...symLinesProps} />
        <Line p1={[-20, -20]} p2={[20, 20]} {...symLinesProps} />
      </>
    ),
  },
]

interface Props {
  value?: Symmetry[]
  onUpdate(value: Symmetry[]): void
}

export default function SymmetryOptions({ value = [], onUpdate }: Props) {
  return (
    <div>
      <InputTitle display="Symmetries" onClear={() => onUpdate([])} />
      <div
        className={css`
          margin-top: 1rem;
          display: grid;
          grid-gap: 0.5rem 1rem;
          grid-template-areas:
            ".    reflectOrtho dihedralOrtho ."
            "none reflectDiag  dihedralDiag  all"
            ".    rotate2      rotate4       .";
        `}
      >
        {symSections.map(({ type: sym, mino, lines }) => {
          const checked = value.includes(sym)
          return (
            <label
              key={sym}
              className={css`
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
                    e.target.checked ? upsert(value, sym) : remove(value, sym),
                  )
                }
              />
              <MinoDiv
                mino={mino}
                fill={checked ? baseColorMap[sym] : "none"}
                stroke={outlineColor}
                size={30 / mino.width}
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
