import React from "react"
import { css } from "emotion"

import { Mino, getSize } from "mino"
import { nodes } from "app/graph"
import useWindowEventListener from "app/useWindowEventListener"

import GenerationList from "./GenerationList"

const START_GENS = 5

interface Props {
  selected?: Mino
  onSelect(mino?: Mino): void
}

/**
 * Displays the list of all minos for each generation
 */
export default function MinoList({ selected, onSelect }: Props) {
  useWindowEventListener("click", (e) => {
    // Deselect the current mino if the click target isn't a mino
    // or the compass
    // TODO this is kind of a hack
    if (!(e.target instanceof SVGElement)) {
      onSelect()
    }
  })

  return (
    <main
      className={css`
        width: 100%;
        max-width: 48rem;
        margin-left: 10rem;
        height: 100vh;
        overflow-y: scroll;
      `}
    >
      {nodes.map((minos, i) => {
        const gen = i + 1
        const hasSelected = !!selected && getSize(selected) === gen
        return (
          <GenerationList
            minos={minos}
            gen={gen}
            key={gen}
            onSelect={onSelect}
            skipAnimation={gen <= START_GENS}
            selected={hasSelected ? selected : undefined}
          />
        )
      })}
    </main>
  )
}
