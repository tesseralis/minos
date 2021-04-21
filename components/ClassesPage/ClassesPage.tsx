import React, { useMemo } from "react"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import { getMinoColor } from "components/graph"
import MinoDiv from "components/MinoList/MinoDiv"
import { Polyomino, displayClass, MinoClass } from "mino"
import { getMinoClasses } from "./classHelpers"

function BoundaryFamily({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border: 1px grey solid;
        padding: 0.5rem;

        > * {
          margin: 0.375rem;
        }
      `}
    >
      {minos.map((mino) => {
        const { stroke, fill } = getMinoColor(mino)
        return (
          <MinoDiv
            key={mino.data}
            mino={mino}
            size={8}
            fill={fill}
            stroke={stroke}
          />
        )
      })}
    </div>
  )
}

function PolyominoClass({
  name,
  area,
  minos,
  link,
}: {
  name: MinoClass
  area: string
  minos: Polyomino[][]
  link?: string
}) {
  return (
    <section
      css={css`
        grid-area: ${area};
        border: 2px grey solid;
        padding: 1rem;
      `}
      id={name}
    >
      <div
        css={css`
          display: flex;
          margin: 0 0.5rem;
        `}
      >
        <h2
          css={css`
            font-size: 1.25rem;
            margin: 0;
          `}
        >
          {capitalize(displayClass(name))}
        </h2>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            css={css`
              margin-left: auto;
              font-size: 1.25rem;
            `}
          >
            ref
          </a>
        )}
      </div>
      <div
        css={css`
          display: flex;
          align-items: stretch;
          flex-wrap: wrap;

          > * {
            margin: 0.5rem;
          }
        `}
      >
        {minos.map((boundaryClass, key) => {
          return <BoundaryFamily minos={boundaryClass} key={key} />
        })}
      </div>
    </section>
  )
}

function Info() {
  return (
    <section
      css={css`
        grid-area: info;
        padding: 1rem 2rem;

        h1 {
          font-size: 1.75rem;
          line-height: 1.125;
        }

        p {
          font-size: 1rem;
        }
      `}
    >
      <h1>Special Classes of Polyominoes</h1>
      <p>
        Several classes of polyominoes are well-studied. This page shows the
        hierarchy of some of these special classes.
      </p>
      <p>
        Sections stacked on top of each other have a hierarchial relationship:
        for example, all stack polyominoes are bar graphs.
      </p>
      <p>
        Additionally, polyominoes with equivalent boundary strings are grouped
        together.
      </p>
    </section>
  )
}

function ClassesChart() {
  const classes = useMemo(() => [...getMinoClasses()], [])
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 18rem 1fr 1fr 4rem 8rem 10rem;
        grid-template-areas:
          "info  info  .     rect  rect  rect"
          "info  info  ferr  ferr  ferr  ferr"
          "stair stair stair stack stack stack"
          "dcvx  dcvx  dcvx  dcvx  bar   bar"
          "cvx   dscvx dscvx dscvx dscvx dscvx"
          "scvx  scvx  scvx  scvx  scvx  dir"
          ".     .     .     .     other other";
      `}
    >
      <Info />
      {classes.map((minoClass, i) => (
        <PolyominoClass key={i} {...minoClass} />
      ))}
    </div>
  )
}

export default function ClassesPage() {
  return (
    <main
      css={css`
        width: 100%;
        max-width: 66rem;
        height: 100vh;
        margin-left: 12rem;
        padding: 1rem 0;
        overflow-y: scroll;
      `}
    >
      <ClassesChart />
    </main>
  )
}
