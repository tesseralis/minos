import React from "react"
import { css } from "@emotion/css"
import { Polyomino, orderName, displayClass } from "mino"
import { Link, useMatch, useNavigate } from "react-router-dom"
import { getMinoColor } from "app/graph"

import MinoList from "app/MinoList"
import MinoDiv from "app/MinoList/MinoDiv"

function MinoInfo({ mino }: { mino: Polyomino }) {
  const navigate = useNavigate()
  return (
    <div>
      <MinoDiv mino={mino} size={12} {...getMinoColor(mino)} />
      <div>{orderName(mino.order)}</div>
      <div>Dimensions: {mino.dims.join(" × ")}</div>
      <div>Symmetry: {mino.transform.symmetry()}</div>
      <div>Class: {displayClass(mino.classes.best())}</div>
      <div>
        Tiling:{" "}
        {mino.tilings.has() ? (
          <Link to={`/tiling/${mino.toString()}`}>yes</Link>
        ) : (
          "no"
        )}
      </div>
      <h2>Parents</h2>
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {[...mino.relatives.freeParents()].map((parent) => (
          <MinoDiv
            key={parent.data}
            mino={parent}
            size={8}
            onClick={() => navigate(`/catalog/${parent.toString()}`)}
            {...getMinoColor(parent)}
          />
        ))}
      </div>
      <h2>Children</h2>
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {mino.order < 8 &&
          [...mino.relatives.freeChildren()].map((child) => (
            <MinoDiv
              key={child.data}
              mino={child}
              size={8}
              onClick={() => navigate(`/catalog/${child.toString()}`)}
              {...getMinoColor(child)}
            />
          ))}
      </div>
    </div>
  )
}

function Sidebar({ mino }: { mino?: Polyomino }) {
  return (
    <main
      className={css`
        margin: 2rem;
      `}
    >
      {mino ? (
        <MinoInfo mino={mino} />
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
