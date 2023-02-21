import React from "react"
import fs from "fs"
import type { GetStaticProps } from "next"
import { useRouter } from "next/router"
import Link from "next/link"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { css } from "@emotion/react"
import { printSymmetry, symmetries, Symmetry } from "mino"
import Layout from "components/Layout"
import MinoList from "./MinoList"
import { getMinosForSymmetry } from "./symmetryHelpers"
import SymmetryIcon from "components/SymmetryIcon"
import { getSymmetryColor } from "components/graph"
import { capitalize } from "lodash"
import NavAndContent from "components/NavAndContent"
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
  source: MDXRemoteSerializeResult
}

export default function SymmetryInfo({ symmetry, source }: Props) {
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
        <MDXRemote {...source} />
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
  const source = fs.readFileSync(
    `${process.cwd()}/pages/symmetry/subpages/${symmetry}.mdx`,
    "utf-8",
  )
  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  })
  return { props: { symmetry, source: mdxSource } }
}
