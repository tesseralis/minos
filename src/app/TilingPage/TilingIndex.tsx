import React from "react"
import { css } from "@emotion/css"

import { useNavigate } from "react-router-dom"
import MinoList from "app/MinoList"
import { nodes } from "app/graph"

// TODO figure out how to make this the same page as TilingPage
const tilingMinos = nodes.map((gen) => gen.filter((mino) => !!mino.tiling()))

export default function TilingPage() {
  const navigate = useNavigate()
  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        padding-top: 3rem;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;

        p {
          margin: 0 2rem;
        }
      `}
    >
      <p>
        A polyomino <em>tiles the plane</em> if it is possible to cover an
        infinite grid with copies of the polyomino such that no holes are left.
        Select a polyomino below to see its tiling.
      </p>

      <MinoList
        minos={tilingMinos}
        onSelect={(mino) => navigate(`${mino?.toString()}`)}
      />
    </div>
  )
}
