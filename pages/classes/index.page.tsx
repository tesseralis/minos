import Link from "next/link"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import Layout from "components/Layout"
import { minoClasses, MinoClass } from "mino"
import { escapeClass, getBoundaryFamilies } from "./classHelpers"
import InfoContent from "./Info.mdx"
import ClassList from "./ClassList"

const areas: Record<MinoClass, string> = {
  rectangle: "rect",
  "Ferrers graph": "ferr",
  staircase: "stair",
  stack: "stack",
  "directed convex": "dcvx",
  "bar graph": "bar",
  convex: "cvx",
  "directed semiconvex": "dscvx",
  semiconvex: "scvx",
  directed: "dir",
  other: "other",
}

function PolyominoClass({ name }: { name: MinoClass }) {
  return (
    <section
      css={css`
        grid-area: ${areas[name]};
        border: 2px grey solid;
        padding: 1rem;
        border-radius: 2px;
      `}
    >
      <h2
        css={css`
          font-size: 1.25rem;
          margin-top: 0;
        `}
      >
        <Link href={`/classes/${escapeClass(name)}`}>
          <a>{capitalize(name)}</a>
        </Link>
      </h2>
      <ClassList minos={getBoundaryFamilies(name)} />
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
  return (
    <Layout>
      <main
        css={css`
          padding: 2rem 0;
          display: grid;
          grid-gap: 1.5rem;
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
        {minoClasses.map((cls) => (
          <PolyominoClass key={cls} name={cls} />
        ))}
      </main>
    </Layout>
  )
}
