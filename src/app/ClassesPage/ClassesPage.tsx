import React, { useMemo } from "react"
import { css } from "@emotion/css"
import { getMinoColor } from "app/graph"
import MinoDiv from "app/MinoList/MinoDiv"
import { Polyomino } from "mino"
import { colors } from "style/theme"
import { getMinoClasses } from "./classHelpers"

function BoundaryFamily({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      className={css`
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
  display,
  minos,
  link,
}: {
  name: string
  display: string
  minos: Polyomino[][]
  link?: string
}) {
  return (
    <section
      className={css`
        grid-area: ${name};
        border: 2px grey solid;
        padding: 1rem;
      `}
    >
      <div
        className={css`
          display: flex;
        `}
      >
        <h2
          className={css`
            font-weight: normal;
            font-size: 1.5rem;
            margin: 0;
          `}
        >
          {display}
        </h2>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className={css`
              color: ${colors.fg};
              margin-left: auto;
              font-size: 1.25rem;
            `}
          >
            ref
          </a>
        )}
      </div>
      <div
        className={css`
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
      className={css`
        grid-area: info;
        padding: 1rem 2rem;

        h1 {
          font-weight: normal;
          line-height: 1.125;
        }

        p {
          font-size: 1.125rem;
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
      className={css`
        display: grid;
        grid-template-columns: 18rem 1fr 1fr 4rem 10rem 12rem;
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
      className={css`
        width: 100%;
        max-width: 72rem;
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
