import React from "react"
import { css } from "@emotion/css"
import { Polyomino } from "mino"
import { useMatch, useNavigate } from "react-router-dom"

import MinoList from "app/MinoList"
import MinoDiv from "app/MinoList/MinoDiv"

function Sidebar({ mino }: { mino?: Polyomino }) {
  return (
    <main
      className={css`
        margin: 2rem;
      `}
    >
      {mino ? (
        <MinoDiv mino={mino} size={10} stroke="black" fill="grey" />
      ) : (
        <>
          <h1>Polyomino Catalog</h1>
          <p>
            This catalog lists all the polyominoes up to octominoes. Select a
            polyomino to see an overview of its properties.
          </p>
        </>
      )}
    </main>
  )
}

/**
 * Displays the list of all minos for each generation
 */
export default function ListPage() {
  const match = useMatch("/catalog/:mino")!
  const code = match?.params?.mino
  // TODO (a11y) ideally, all the minos should be links...
  const navigate = useNavigate()
  const mino = code ? Polyomino.fromString(code) : undefined

  return (
    <div
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
        <MinoList
          onSelect={(mino) => navigate(`/catalog/${mino?.toString()}`)}
        />
      </div>
      <Sidebar mino={mino} />
    </div>
  )
}
