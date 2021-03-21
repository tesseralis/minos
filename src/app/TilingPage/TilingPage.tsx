import React from "react"
import { css } from "emotion"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"
import Tiling from "./Tiling"

export default function TilingPage() {
  const { params } = useMatch("/tiling/:mino")!
  const code = params.mino
  const mino = Polyomino.fromString(code)
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
