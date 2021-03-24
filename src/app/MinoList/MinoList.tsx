import React from "react"
import { css } from "@emotion/css"

import type { Polyomino } from "mino"
import GenerationList from "./GenerationList"

const START_GENS = 6

interface Props {
  /** The list of polyominoes to display */
  minos: Polyomino[][]
  narrow?: boolean
  selected?: Polyomino | null
  onSelect(mino: Polyomino | null): void
}

/**
 * Displays the list of all minos for each generation
 */
export default function MinoList({
  minos,
  selected = null,
  onSelect,
  narrow,
}: Props) {
  return (
    <div
      className={css`
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      `}
    >
      {minos.map((minos, i) => {
        const gen = i + 1
        const hasSelected = !!selected && selected.order === gen
        return (
          <GenerationList
            narrow={narrow}
            minos={minos}
            gen={gen}
            key={gen}
            skipAnimation={gen <= START_GENS}
            selected={hasSelected ? selected : null}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}
