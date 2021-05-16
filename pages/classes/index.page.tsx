import { useMemo } from "react"
import Link from "next/link"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import Layout from "components/Layout"
import { Polyomino, MinoClass } from "mino"
import { getMinoClasses, escapeClass } from "./classHelpers"
import InfoContent from "./Info.mdx"
import ClassList from "./ClassList"

function PolyominoClass({
  name,
  area,
  minos,
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
      id={name /* FIXME */}
    >
      <h2
        css={css`
          font-size: 1.25rem;
          margin: 0 0.5rem;
        `}
      >
        <Link href={`/classes/${escapeClass(name)}`}>
          <a>{capitalize(name)}</a>
        </Link>
      </h2>
      <ClassList minos={minos} />
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
      <InfoContent />
    </section>
  )
}

export default function ClassesChart() {
  const classes = useMemo(() => [...getMinoClasses()], [])
  return (
    <Layout>
      <main
        css={css`
          padding: 2rem 0;
          display: grid;
          grid-gap: 1rem;
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
      </main>
    </Layout>
  )
}
