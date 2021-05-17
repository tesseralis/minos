import { capitalize } from "lodash"
import fs from "fs"
import type { GetStaticProps } from "next"
import { useRouter } from "next/router"
import Link from "next/link"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { css } from "@emotion/react"
import { minoClasses } from "mino"
import Layout from "components/Layout"
import { getBoundaryFamilies, escapeClass, unescapeClass } from "./classHelpers"
import ClassList from "./ClassList"
import { colors } from "style/theme"

// TODO deduplicate with symmetry nav
function ClassNav() {
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
      <h2>Classes</h2>
      <ul>
        {minoClasses.map((cls) => {
          const href = `/classes/${escapeClass(cls)}`
          return (
            <li key={cls}>
              <Link href={href} passHref>
                <a
                  css={css`
                    text-decoration: none;
                    color: ${router.asPath.startsWith(href)
                      ? colors.highlight
                      : colors.fg};
                  `}
                >
                  {cls}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function ClassInfo({ class: cls, source }: any) {
  return (
    <Layout subNav={<ClassNav />}>
      <main
        css={css`
          padding: 2rem 0;
          max-width: 36rem;

          h1 {
            margin: 0;
          }
        `}
      >
        <Link href="/classes">
          <a>Back</a>
        </Link>
        <h1>{capitalize(cls)} polyomino</h1>
        <MDXRemote {...source} />
        <h2>Polyomino list</h2>
        <ClassList minos={getBoundaryFamilies(cls)} />
      </main>
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: minoClasses
      .map(escapeClass)
      .map((cls) => ({ params: { class: cls } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { class: cls } = params as any
  const source = fs.readFileSync(
    `${process.cwd()}/pages/classes/subpages/${cls}.mdx`,
    "utf-8",
  )
  const mdxSource = await serialize(source)
  return { props: { class: unescapeClass(cls), source: mdxSource } }
}
