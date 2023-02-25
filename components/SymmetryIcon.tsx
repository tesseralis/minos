import { Polyomino, Symmetry } from "mino"
import React, { ReactNode } from "react"
import { Circle, Line } from "components/svg"
import MinoDiv from "./MinoDiv"
import { css } from "@emotion/react"
import tinycolor from "tinycolor2"
import SymmetryMarkers from "./SymmetryMarkers"

interface Props {
  symmetry: Symmetry
  fill: string
  stroke: string
  size: number
}

// Icon representing a particular symmetry class
export default function SymmetryIcon({ symmetry, fill, stroke, size }: Props) {
  const mino = Polyomino.of(minoMap[symmetry])
  const minoStroke = tinycolor(stroke).setAlpha(0.5).toString()

  return (
    <div
      css={css`
        > svg {
          overflow: visible;
        }
      `}
    >
      <MinoDiv
        mino={mino}
        fill={fill}
        stroke={minoStroke}
        size={size / mino.height}
        gridStyle="none"
      >
        <SymmetryMarkers
          mino={mino}
          size={size / mino.height}
          stroke={stroke}
        />
      </MinoDiv>
    </div>
  )
}

const minoMap: Record<Symmetry, string> = {
  all: "010_111_010",
  axis2: "101_111_101",
  diag2: "110_111_011",
  rot2: "0010_1110_0111_0100",
  axis: "100_111_100",
  diag: "100_110_011",
  rot: "001_111_100",
  none: "010_110_011",
}
