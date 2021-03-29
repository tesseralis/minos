import React from "react"
import { css } from "@emotion/css"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"

import Tiling from "./Tiling"
import MinoList from "app/MinoList"
import { useNavigate } from "react-router-dom"

function Index() {
  return (
    <div>
      <h1>Tiling the plane</h1>
      <p>
        A polyomino <em>tiles the plane</em> if it is possible to cover an
        infinite grid with copies of the polyomino such that no holes are left.
      </p>
      <p>Select a polyomino to see its tiling.</p>
    </div>
  )
}

export default function TilingPage() {
  const match = useMatch("/tiling/:mino")!
  const code = match?.params?.mino
  // TODO (a11y) ideally, all the minos should be links...
  const navigate = useNavigate()
  const mino = code && Polyomino.fromString(code)

  return (
    <div
      className={css`
        width: 100%;
        max-width: 54rem;
        height: 100vh;
        margin-left: 10rem;
        padding-top: 3rem;
        display: grid;
        grid-template-columns: 24rem 1fr;
        grid-gap: 2rem;
      `}
    >
      <div
        className={css`
          overflow-y: scroll;
        `}
      >
        <MinoList
          narrow
          onSelect={(mino) => navigate(`/tiling/${mino?.toString()}`)}
        />
      </div>
      <div>{mino ? <Tiling mino={mino} /> : <Index />}</div>
    </div>
  )
}
