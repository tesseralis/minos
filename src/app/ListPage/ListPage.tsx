import React from "react"
import { css } from "@emotion/css"
import useWindowEventListener from "app/useWindowEventListener"

import MinoList from "app/MinoList"
import { useSelected, useSetSelected } from "app/SelectedContext"

function Sidebar() {
  return (
    <section
      className={css`
        margin: 2rem;
      `}
    >
      <h1>Polyomino Catalog</h1>
      <p>
        This catalog lists all the polyominoes up to octominoes. Select a
        polyomino to see an overview of its properties.
      </p>
    </section>
  )
}

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
        height: 100vh;
        margin-left: 10rem;
        display: grid;
        grid-template-columns: 1fr 24rem;
      `}
    >
      <div
        className={css`
          overflow-y: scroll;
        `}
      >
        <MinoList selected={selected} onSelect={setSelected} />
      </div>
      <Sidebar />
    </main>
  )
}
