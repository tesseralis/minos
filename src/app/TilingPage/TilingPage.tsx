import React from "react"
import { css } from "@emotion/css"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"

import Tiling from "./Tiling"
import MinoList from "app/MinoList"
import { nodes } from "app/graph"
import { useNavigate } from "react-router-dom"

const tilingMinos = nodes.map((gen) => gen.filter((mino) => !!mino.tiling()))

export default function TilingPage() {
  const { params } = useMatch("/tiling/:mino")!
  const code = params.mino
  const mino = Polyomino.fromString(code)
  // TODO (a11y) ideally, all the minos should be links...
  const navigate = useNavigate()

  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
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
          minos={tilingMinos}
          onSelect={(mino) => navigate(`/tiling/${mino?.toString()}`)}
        />
      </div>
      <div>
        <Tiling mino={mino} />
      </div>
    </div>
  )
}
