import React, { ReactElement } from "react"
import type { GetStaticProps } from "next"
import Link from "next/link"
import { css } from "@emotion/react"
import { symmetries, Symmetry } from "mino"
import MinoList from "./MinoList"

import all from "./subpages/all.mdx"
import rot2 from "./subpages/rot2.mdx"
import axis2 from "./subpages/axis2.mdx"
import diag2 from "./subpages/diag2.mdx"
import rot from "./subpages/rot.mdx"
import axis from "./subpages/axis.mdx"
import diag from "./subpages/diag.mdx"
import none from "./subpages/none.mdx"
import SymmetryLayout from "./Layout"

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

export default function Page({ symmetry }: Props) {
  const Text = pages[symmetry]
  return (
    <div>
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
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <SymmetryLayout>{page}</SymmetryLayout>
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
