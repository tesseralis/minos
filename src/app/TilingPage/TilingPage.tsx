import React from "react"
import { css } from "@emotion/css"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"

import { useSelected, useSetSelected } from "app/SelectedContext"
import Tiling from "./Tiling"

export default function TilingPage() {
  const { params } = useMatch("/tiling/:mino")!
  const code = params.mino
  const mino = Polyomino.fromString(code)

  // If no selection context, set it to the current mino.
  // TODO (bug) this triggers a console error when run
  const selected = useSelected()
  const setSelected = useSetSelected()
  if (!selected) {
    setSelected(mino)
  }

  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        margin-top: 3rem;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Tiling mino={mino} />
    </div>
  )
}
