import Link from "next/link"
import { css } from "@emotion/react"
import { nodes, getMinoColor } from "components/graph"
import { capitalize, groupBy } from "lodash"
import { Polyomino, printSymmetry, Symmetry, symmetries } from "mino"
import MinoLink from "components/MinoLink"
import Layout from "components/Layout"
import InfoContent from "./Info.mdx"

function getMinosBySymmetry() {
  const minos = nodes.flat()
  const symClasses = groupBy(minos, (m) => m.transform.symmetry())
  return symmetries.map((sym) => ({ name: sym, minos: symClasses[sym] }))
}

function SymmetryClass({
  name,
  minos,
}: {
  name: Symmetry
  minos: Polyomino[]
}) {
  return (
    <section
      id={name}
      css={css`
        grid-area: ${name};
        border: 1px solid grey;
        padding: 1rem;

        h2 {
          margin: 0;
          font-size: 1.25rem;
        }
      `}
    >
      <h2>
        <Link href={`/symmetry/${name}`}>
          <a>{capitalize(printSymmetry(name))}</a>
        </Link>
      </h2>
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          > * {
            margin: 0.5rem;
          }
        `}
      >
        {minos.map((mino) => {
          const { stroke, fill } = getMinoColor(mino)
          return (
            <MinoLink
              to={`/catalog/${mino.toString()}`}
              key={mino.data}
              mino={mino}
              size={8}
              fill={fill}
              stroke={stroke}
            />
          )
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
        h1 {
          margin: 0;
        }
        p {
          margin: 1rem 0;
        }
      `}
    >
      <InfoContent />
    </section>
  )
}

export default function SymmetryChart() {
  const symClasses = getMinosBySymmetry()
  return (
    <Layout>
      <main
        css={css`
          padding: 2rem 0;
          display: grid;
          grid-gap: 1rem;
          grid-template-areas:
            "info  all  ."
            "axis2 rot2 diag2"
            "axis  rot  diag"
            "none  none none";
        `}
      >
        <Info />
        {symClasses.map(({ name, minos }, i) => (
          <SymmetryClass key={i} name={name} minos={minos} />
        ))}
      </main>
    </Layout>
  )
}
