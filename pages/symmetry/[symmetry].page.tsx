import fs from "fs"
import type { GetStaticProps } from "next"
import { useRouter } from "next/router"
import Link from "next/link"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import { css } from "@emotion/react"
import { printSymmetry, symmetries, Symmetry } from "mino"
import Layout from "components/Layout"
import MinoList from "./MinoList"
import { getMinosForSymmetry } from "./symmetryHelpers"
import { colors } from "style/theme"

// TODO deduplicate with classes nav
function SymmetryNav() {
  const router = useRouter()
  return (
    <nav
      css={css`
        h2 {
          font-size: 1.25rem;
          margin: 0;
        }

        ul {
          margin: 0;
        }
      `}
    >
      <h2>Symmetries</h2>
      <ul>
        {symmetries.map((symmetry) => {
          const href = `/symmetry/${symmetry}`
          return (
            <li key={symmetry}>
              <Link href={href} passHref>
                <a
                  css={css`
                    text-decoration: none;
                    color: ${router.asPath === href
                      ? colors.highlight
                      : colors.fg};
                  `}
                >
                  {printSymmetry(symmetry)}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

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
  return (
    <Layout subNav={<SymmetryNav />}>
      <main
        css={css`
          padding: 2rem 0;
          max-width: 36rem;

          h1 {
            margin: 0;
          }
        `}
      >
        <Link href="/symmetry">
          <a>Back</a>
        </Link>
        <h1>{longName[symmetry]}</h1>
        <MDXRemote {...source} />
        <h2>Polyomino list</h2>
        <MinoList minos={getMinosForSymmetry(symmetry)} />
      </main>
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
  const mdxSource = await serialize(source)
  return { props: { symmetry, source: mdxSource } }
}
