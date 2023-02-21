import Link from "next/link"
import { css } from "@emotion/react"
import { capitalize } from "lodash"
import { printSymmetry, Symmetry, symmetries } from "mino"
import Layout from "components/Layout"
import InfoContent from "./Info.mdx"
import { getMinosForSymmetry } from "./symmetryHelpers"
import MinoList from "./MinoList"
import { media } from "style/media"

function SymmetryClass({ sym }: { sym: Symmetry }) {
  return (
    <section
      css={css`
        grid-area: ${sym};
        border: 1px solid grey;
        padding: 1rem;

        h2 {
          margin: 0;
          font-size: 1.25rem;
        }
      `}
    >
      <h2>
        <Link href={`/symmetry/${sym}`}>{capitalize(printSymmetry(sym))}</Link>
      </h2>
      <MinoList minos={getMinosForSymmetry(sym)} />
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
  return (
    <Layout>
      <main
        css={css`
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          @media ${media.sm} {
            display: grid;
            grid-template-areas:
              "info  all  ."
              "axis2 rot2 diag2"
              "axis  rot  diag"
              "none  none none";
          }
        `}
      >
        <Info />
        {symmetries.map((symmetry) => (
          <SymmetryClass key={symmetry} sym={symmetry} />
        ))}
      </main>
    </Layout>
  )
}
