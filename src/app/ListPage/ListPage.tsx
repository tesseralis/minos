import React, { ReactNode } from "react"
import { css } from "@emotion/css"
import { capitalize } from "lodash-es"
import { Polyomino, orderName, displayClass, printSymmetry } from "mino"
import { Link, useMatch, useNavigate } from "react-router-dom"
import { getMinoColor } from "app/graph"

import MinoList from "app/MinoList"
import MinoDiv from "app/MinoList/MinoDiv"

interface MinoDatum {
  name: string
  display(mino: Polyomino): ReactNode
}

const data: MinoDatum[] = [
  {
    name: "order",
    display: (m) => `${m.order} (${orderName(m.order)})`,
  },
  {
    name: "dimensions",
    display: (m) => m.dims.join(" × "),
  },
  {
    name: "symmetry",
    display: (m) => printSymmetry(m.transform.symmetry()),
  },
  {
    name: "class",
    display: (m) => displayClass(m.classes.best()),
  },
  {
    name: "tiling",
    display: (m) => (
      <>
        {m.tilings.has() ? (
          <Link to={`/tiling/${m.toString()}`}>yes</Link>
        ) : (
          "no"
        )}
      </>
    ),
  },
  {
    name: "parents",
    display: (m) => (
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {[...m.relatives.freeParents()].map((parent) => (
          <MinoDiv
            key={parent.data}
            mino={parent}
            size={8}
            {...getMinoColor(parent)}
          />
        ))}
      </div>
    ),
  },
  {
    name: "children",
    display: (m) => (
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {m.order < 8 &&
          [...m.relatives.freeChildren()].map((child) => (
            <MinoDiv
              key={child.data}
              mino={child}
              size={8}
              {...getMinoColor(child)}
            />
          ))}
      </div>
    ),
  },
]

function MinoInfo({ mino }: { mino: Polyomino }) {
  // const navigate = useNavigate()
  return (
    <>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          // Constant height so lower parts don't shift down
          height: 6rem;
        `}
      >
        <MinoDiv mino={mino} size={96 / mino.order} {...getMinoColor(mino)} />
      </div>
      <dl>
        {data.map(({ name, display }) => (
          <>
            <dt
              className={css`
                font-size: 1.125rem;
              `}
            >
              {capitalize(name)}
            </dt>
            <dd
              className={css`
                margin: 0;
                margin-bottom: 0.5rem;
              `}
            >
              {display(mino)}
            </dd>
          </>
        ))}
      </dl>
    </>
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
