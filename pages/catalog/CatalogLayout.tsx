import React, { ReactElement, ReactNode } from "react"
import Link from "next/link"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import { scaleLinear } from "d3-scale"
import { Polyomino, orderName, printSymmetry } from "mino"
import { getMinoColor, NUM_GENERATIONS } from "components/graph"
import { escapeClass } from "pages/classes/classHelpers"
import Layout from "components/Layout"

import MinoList from "components/MinoList"
import MinoLink from "components/MinoLink"
import MinoDiv from "components/MinoDiv"
import Tiling from "components/Tiling"
import { useRouter } from "next/router"
import NavAndContent from "components/NavAndContent"

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
    name: "size",
    display: (m) => `${m.order} (${orderName(m.order)})`,
  },
  {
    name: "dimensions",
    display: (m) => m.dims.join(" × "),
  },
  {
    name: "symmetry",
    display: (m) => (
      <Link href={`/symmetry/${m.transform.symmetry()}`}>
        {printSymmetry(m.transform.symmetry())}
      </Link>
    ),
  },
  {
    name: "class",
    display: (m) => (
      <Link href={`/classes/${escapeClass(m.classes.get().name())}`}>
        {m.classes.get().name()}
      </Link>
    ),
  },
  {
    name: "tiling",
    display: (m) =>
      m.tilings.has() ? (
        <div
          css={css`
            position: relative;
            width: 100px;
          `}
        >
          <Link href={`/tiling/${m.toString()}`}>
            <Tiling mino={m} gridSize={8} />
          </Link>
        </div>
      ) : (
        "no"
      ),
  },
  {
    name: "parents",
    display: (m) =>
      m.order > 1 ? (
        <List minos={Polyomino.sort([...m.relatives.freeParents()])} />
      ) : (
        "——"
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

export function MinoInfo({ mino }: { mino: Polyomino }) {
  return (
    <>
      <Link href="/catalog">close</Link>
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
      <dl
        css={css`
          display: grid;
          grid-template-areas:
            "size dimensions"
            "symmetry class"
            "tiling tiling"
            "parents parents"
            "children children";
        `}
      >
        {data.map(({ name, display }) => (
          <div
            key={name}
            css={css`
              grid-area: ${name};
            `}
          >
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
          </div>
        ))}
      </dl>
    </>
  )
}

/**
 * Displays the minos of each generation and allows the user to select
 * one and open a list of information about it.
 */
export default function CatalogLayout({
  children,
}: {
  children?: ReactElement
}) {
  const router = useRouter()
  const { mino } = router.query
  const polyomino = mino ? Polyomino.fromString(mino as any) : null
  return (
    <Layout>
      <NavAndContent
        columns="1fr 28rem"
        nav={
          <MinoList
            to={(mino) => `/catalog/${mino.toString()}`}
            selected={polyomino}
          />
        }
      >
        {children}
      </NavAndContent>
    </Layout>
  )
}
