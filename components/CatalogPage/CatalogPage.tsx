import React, { ReactNode } from "react"
import Link from "next/link"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import { scaleLinear } from "d3-scale"
import { Polyomino, orderName, displayClass, printSymmetry } from "mino"
import { getMinoColor, NUM_GENERATIONS } from "components/graph"

import MinoList from "components/MinoList"
import MinoLink from "components/MinoLink"
import MinoDiv from "components/MinoDiv"
import Tiling from "components/TilingPage/Tiling"

interface MinoDatum {
  name: string
  display(mino: Polyomino): ReactNode
}

const getBlockSize = scaleLinear().domain([1, NUM_GENERATIONS]).range([12, 8])

function List({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      css={css`
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
    display: (m) => (
      <Link href={`/symmetry#${m.transform.symmetry()}`}>
        <a>{printSymmetry(m.transform.symmetry())}</a>
      </Link>
    ),
  },
  {
    name: "class",
    display: (m) => (
      <Link href={`/classes#${m.classes.best()}`}>
        <a>{displayClass(m.classes.best())}</a>
      </Link>
    ),
  },
  {
    name: "tiling",
    display: (m) =>
      m.tilings.has() ? (
        <Link href={`/tiling/${m.toString()}`}>
          <a>
            <Tiling mino={m} gridSize={8} svgSize={100} />
          </a>
        </Link>
      ) : (
        "no"
      ),
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
      <Link href="/catalog">
        <a>close</a>
      </Link>
      <div
        css={css`
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
              css={css`
                font-size: 1.125rem;
              `}
            >
              {capitalize(name)}
            </dt>
            <dd
              css={css`
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
      css={css`
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
export default function CatalogPage({ mino }: { mino?: Polyomino }) {
  return (
    <div
      css={css`
        width: 100%;
        height: 100vh;
        margin-left: 10rem;
        display: grid;
        grid-template-columns: 1fr 24rem;
      `}
    >
      <div
        css={css`
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