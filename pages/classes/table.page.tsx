import Link from "next/link"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import Layout from "components/Layout"
import { escapeClass } from "./classHelpers"
import { colors } from "style/theme"
import TableText from "./TableText.mdx"
import ClassList from "./ClassList"
import { DirClass } from "mino"
import { ClassRegex } from "./words"
import ClassSymbol from "./ClassSymbol"

// List of arrow grid positions
const arrowPositions = [
  { row: 1, column: "4 / span 3" },
  { row: 2, column: 3 },
  { row: 2, column: "4 / span 3" },
  { row: 3, column: "1 / span 3" },
  { row: 3, column: 4 },
  { row: 3, column: "5 / span 2" },
  { row: 4, column: "1 / span 2" },
  { row: 4, column: "3 / span 2" },
  { row: 4, column: "5 / span 2" },
  { row: 5, column: "1 / span 2" },
  { row: 5, column: "3 / span 3" },
  { row: 5, column: 6 },
  { row: 6, column: "1 / span 3" },
  { row: 6, column: "4 / span 2" },
  { row: 6, column: 6 },
  { row: 7, column: "2 / span 2" },
  { row: 7, column: "4 / span 2" },
  { row: 8, column: "2 / span 4" },
]

function PolyominoClass({ dirClass }: { dirClass: DirClass }) {
  return (
    <section
      css={css`
        grid-area: ${dirClass.code()};
        border: 2px grey solid;
        padding: 1.5rem 1rem;
        border-radius: 2px;
        position: relative;
      `}
    >
      <h2
        css={css`
          font-size: 1.25rem;
          margin: 0;
          margin-bottom: 0.5rem;
        `}
      >
        <Link href={`/classes/${escapeClass(dirClass.name())}`}>
          {capitalize(dirClass.name())}
        </Link>{" "}
        (<ClassSymbol dirClass={dirClass} />)
      </h2>
      <ClassRegex dirClass={dirClass} />
      <ClassList dirClass={dirClass} />
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
      <TableText />
    </section>
  )
}

interface ArrowProps {
  row: number | string
  column: number | string
}

function Arrow({ row, column }: ArrowProps) {
  return (
    <div
      css={css`
        grid-row: ${row};
        grid-column: ${column};
        align-self: end;
        justify-self: center;
        position: relative;

        ::after {
          position: absolute;
          top: -15px;
          left: -15px;
          content: "";
          border: solid grey;
          border-width: 0 2px 2px 0;
          padding: 13px;
          transform: rotate(45deg);
          background: ${colors.bg};
        }
      `}
    />
  )
}

export default function ClassesChart() {
  return (
    <Layout>
      <main
        css={css`
          padding: 2rem;
          display: grid;
          grid-gap: 1.5rem;
          grid-template-areas:
            "info  info  .     rect  rect  rect"
            "info  info  ferr  ferr  ferr  ferr"
            "stair stair stair stack stack stack"
            "fork  fork  fork  fork  bar   bar"
            "cross cross wing  wing  wing  wing"
            "cres  cres  cres  cres  cres  ant"
            "range range range btree btree btree"
            ".     tree  tree  tree  tree  ."
            ".     other other other other .";
        `}
      >
        <Info />
        {DirClass.all().map((dirClass) => (
          <PolyominoClass key={dirClass.code()} dirClass={dirClass} />
        ))}
        {arrowPositions.map((arrow, i) => (
          <Arrow key={i} {...arrow} />
        ))}
      </main>
    </Layout>
  )
}
