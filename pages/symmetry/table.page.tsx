import Link from "next/link"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import { printSymmetry, Symmetry, symmetries } from "mino"
import Layout from "components/Layout"
import MinoList from "./MinoList"
import { media } from "style/media"
import Breadcrumbs from "components/Breadcrumbs"

function SymmetryClass({ sym }: { sym: Symmetry }) {
  return (
    <section
      style={{ gridArea: sym }}
      css={css`
        border: 1px solid grey;
        padding: 1rem;

        h2 {
          margin: 0;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }
      `}
    >
      <h2>
        <Link href={`/symmetry/${sym}`}>{capitalize(printSymmetry(sym))}</Link>
      </h2>
      <MinoList symmetry={sym} />
    </section>
  )
}

export default function SymmetryChart() {
  return (
    <Layout>
      <div
        css={css`
          padding: 2rem;
        `}
      >
        <Breadcrumbs
          paths={[
            ["Symmetry", "/symmetry"],
            ["Table", "/symmetry/table"],
          ]}
        />
        <main
          css={css`
            display: flex;
            flex-direction: column;
            gap: 1rem;
            @media ${media.sm} {
              display: grid;
              grid-template-areas:
                ".     all  ."
                "axis2 rot2 diag2"
                "axis  rot  diag"
                "none  none none";
            }
          `}
        >
          {symmetries.map((symmetry) => (
            <SymmetryClass key={symmetry} sym={symmetry} />
          ))}
        </main>
      </div>
    </Layout>
  )
}
