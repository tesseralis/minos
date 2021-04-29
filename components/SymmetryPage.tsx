import { css } from "@emotion/react"
import { nodes, getMinoColor } from "components/graph"
import { capitalize, groupBy } from "lodash"
import { Polyomino, printSymmetry, Symmetry, symmetries } from "mino"
import MinoLink from "components/MinoLink"

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
      <h2>{capitalize(printSymmetry(name))}</h2>
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
      <h1>Symmetry</h1>
      <p>
        Polyominoes can be classified by their <em>symmetries</em>. A polyomino
        is symmetric if it can be rotated or reflected to yield the same
        polyomino.
      </p>
      <p>This page lists the polyominoes by their symmetry classes.</p>
    </section>
  )
}

function SymmetryChart() {
  const symClasses = getMinosBySymmetry()
  return (
    <div
      css={css`
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
    </div>
  )
}

export default function SymmetryPage() {
  return (
    <main
      css={css`
        width: 100%;
        max-width: 64rem;
        height: 100vh;
        margin-left: 12rem;
        padding: 1rem 0;
        overflow-y: scroll;
      `}
    >
      <SymmetryChart />
    </main>
  )
}
