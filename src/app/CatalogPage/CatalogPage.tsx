import React, { ReactNode } from "react"
import { css } from "@emotion/css"
import { capitalize } from "lodash-es"
import { scaleLinear } from "d3-scale"
import { Polyomino, orderName, displayClass, printSymmetry } from "mino"
import { Link, useMatch } from "react-router-dom"
import { getMinoColor, NUM_GENERATIONS } from "app/graph"

import MinoList from "app/MinoList"
import MinoLink from "app/MinoLink"
import MinoDiv from "app/MinoList/MinoDiv"

interface MinoDatum {
  name: string
  display(mino: Polyomino): ReactNode
}

const getBlockSize = scaleLinear().domain([1, NUM_GENERATIONS]).range([12, 8])

function List({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      className={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        > * {
          margin: 0.375rem;
        }
      `}
    >
      {minos.map((mino) => (
        <MinoLink
          key={mino.data}
          mino={mino}
          size={getBlockSize(mino.order)}
          {...getMinoColor(mino)}
          to={`/catalog/${mino.toString()}`}
        />
      ))}
    </div>
  )
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
    display: (m) =>
      m.tilings.has() ? <Link to={`/tiling/${m.toString()}`}>yes</Link> : "no",
  },
  {
    name: "parents",
    display: (m) => (
      <List minos={Polyomino.sort([...m.relatives.freeParents()])} />
    ),
  },
  {
    name: "children",
    display: (m) =>
      m.order < 8 ? (
        <List minos={Polyomino.sort([...m.relatives.freeChildren()])} />
      ) : (
        "——"
      ),
  },
]

function MinoInfo({ mino }: { mino: Polyomino }) {
  return (
    <>
      <Link to="/catalog">close</Link>
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
        padding: 2rem;
        overflow-y: scroll;
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
 * Displays the minos of each generation and allows the user to select
 * one and open a list of information about it.
 */
export default function CatalogPage() {
  const match = useMatch("/catalog/:mino")!
  const code = match?.params?.mino
  // TODO (a11y) ideally, all the minos should be links...
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
          to={(mino) => `/catalog/${mino.toString()}`}
          selected={mino}
        />
      </div>
      <Sidebar mino={mino} />
    </div>
  )
}
