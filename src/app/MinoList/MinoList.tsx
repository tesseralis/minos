import React from "react"
import { css } from "emotion"

import { getSize } from "mino"
import { nodes } from "app/graph"
import useWindowEventListener from "app/useWindowEventListener"
import { useSelected, useSetSelected } from "app/SelectedContext"

import GenerationList from "./GenerationList"

const START_GENS = 5

/**
 * Displays the list of all minos for each generation
 */
export default function MinoList() {
  const selected = useSelected()
  const setSelected = useSetSelected()
  useWindowEventListener("click", (e) => {
    // Deselect the current mino if the click target isn't a mino
    // or the compass
    // TODO this is kind of a hack
    if (!(e.target instanceof SVGElement)) {
      setSelected(null)
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
            skipAnimation={gen <= START_GENS}
            selected={hasSelected ? selected : null}
          />
        )
      })}
    </main>
  )
}
