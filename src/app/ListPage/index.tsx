import React from "react"
import { css } from "@emotion/css"
import useWindowEventListener from "app/useWindowEventListener"

import MinoList from "app/MinoList"
import { useSelected, useSetSelected } from "app/SelectedContext"

/**
 * Displays the list of all minos for each generation
 */
export default function ListPage() {
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
        height: 100vh;
        margin-left: 10rem;
        overflow-y: scroll;
      `}
    >
      <MinoList selected={selected} onSelect={setSelected} />
    </main>
  )
}
