import React from "react"
import type { GetStaticProps } from "next"
import { useRouter } from "next/router"
import Link from "next/link"
import { css } from "@emotion/react"
import { printSymmetry, symmetries, Symmetry } from "mino"
import Layout from "components/Layout"
import MinoList from "./MinoList"
import SymmetryIcon from "components/SymmetryIcon"
import { getSymmetryColor } from "components/graph"
import { capitalize } from "lodash"
import NavAndContent from "components/NavAndContent"

import all from "./subpages/all.mdx"
import rot2 from "./subpages/rot2.mdx"
import axis2 from "./subpages/axis2.mdx"
import diag2 from "./subpages/diag2.mdx"
import rot from "./subpages/rot.mdx"
import axis from "./subpages/axis.mdx"
import diag from "./subpages/diag.mdx"
import none from "./subpages/none.mdx"

const pages = { all, rot2, axis2, diag2, rot, axis, diag, none }

const longName: Record<Symmetry, string> = {
  all: "Full symmetry",
  axis2: "Reflective symmetry (2 axes)",
  diag2: "Diagonal symmetry (2 diagonals)",
  rot2: "Rotational symmetry (4-fold)",
  axis: "Reflective symmetry (axis)",
  diag: "Reflective symmetry (diagonal)",
  rot: "Rotational symmetry (2-fold)",
  none: "Asymmetry",
}

interface Props {
  symmetry: Symmetry
}

export default function SymmetryInfo({ symmetry }: Props) {
  const Text = pages[symmetry]
  const router = useRouter()
  return (
    <Layout>
      <NavAndContent
        columns="24rem 1fr"
        nav={
          <div
            css={css`
              display: grid;
              padding-top: 2rem;
              gap: 1rem 0.75rem;
              align-content: start;
              grid-template-areas:
                ".     all  ."
                "axis2 rot2 diag2"
                "axis  rot  diag"
                ".     none .";
            `}
          >
            {symmetries.map((symmetry) => {
              const route = `/symmetry/${symmetry}`
              const isActive = router.asPath === route
              const name = capitalize(printSymmetry(symmetry))
              // split into two lines based on where the first space is
              // https://stackoverflow.com/a/4607799 (why is JS so bad)
              const [first, last] = name.split(/ (.*)/)
              return (
                <Link
                  key={symmetry}
                  href={route}
                  css={css`
                    grid-area: ${symmetry};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 0.5rem;
                    text-decoration: ${isActive ? "underline" : "none"};
                  `}
                >
                  <SymmetryIcon
                    symmetry={symmetry}
                    size={50}
                    fill="none"
                    stroke={getSymmetryColor(symmetry)}
                  />
                  {last ? (
                    <>
                      {first}
                      <br />
                      {last}
                    </>
                  ) : (
                    first
                  )}
                </Link>
              )
            })}
          </div>
        }
      >
        <Link href="/symmetry">Back</Link>
        <h1
          css={css`
            margin: 0;
          `}
        >
          {longName[symmetry]}
        </h1>
        <Text />
        <h2>Polyomino list</h2>
        <MinoList symmetry={symmetry} />
      </NavAndContent>
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: symmetries.map((symmetry) => ({ params: { symmetry } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // TODO type this correctly
  const { symmetry } = params as any
  return { props: { symmetry } }
}
