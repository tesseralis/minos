import { capitalize } from "lodash"
import fs from "fs"
import type { GetStaticProps } from "next"
import { useRouter } from "next/router"
import Link from "next/link"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { css } from "@emotion/react"
import { getClassCode, MinoClass, minoClasses } from "mino"
import Layout from "components/Layout"
import { getBoundaryFamilies, escapeClass, unescapeClass } from "./classHelpers"
import ClassList from "./ClassList"
import { colors } from "style/theme"
import ClassIcon from "components/ClassIcon"
import { getClassColor } from "components/graph"

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
              <Link
                href={href}
                passHref
                css={css`
                  text-decoration: none;
                  color: ${router.asPath.startsWith(href)
                    ? colors.highlight
                    : colors.fg};
                `}
              >
                {cls}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

interface Props {
  class: MinoClass
  source: MDXRemoteSerializeResult
}

export default function ClassInfo({ class: cls, source }: Props) {
  const router = useRouter()
  return (
    <Layout>
      <div
        css={css`
          position: absolute;
          height: 100%;
          display: grid;
          grid-template-columns: 24rem 1fr;
          gap: 2rem;
        `}
      >
        <nav
          css={css`
            padding-top: 2rem;
            display: grid;
            align-content: start;
            gap: 2rem 1rem;
            grid-template-columns: repeat(4, 1fr);
            grid-template-areas:
              ".     .    rect  ."
              ".     ferr rect  ."
              "stair ferr stack ."
              "stair fork stack bar"
              "cross fork wing  bar"
              "cross cres wing  ant"
              "range cres btree ant"
              "range tree btree ."
              ".     tree other ."
              ".     .    other .";
          `}
        >
          {minoClasses
            .filter((x) => x !== "punctured rectangle")
            .map((cls) => {
              const route = `/classes/${escapeClass(cls)}`
              const isActive = router.asPath === route
              return (
                <Link
                  key={cls}
                  href={route}
                  css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 0.5rem;
                    grid-area: ${getClassCode(cls)};
                    text-decoration: ${isActive ? "underline" : "none"};
                  `}
                >
                  <ClassIcon
                    class={cls}
                    fill={"none"}
                    stroke={getClassColor(cls)}
                    size={60}
                  />
                  {capitalize(cls)}
                </Link>
              )
            })}
        </nav>
        <main
          css={css`
            padding: 2rem;
            max-height: 100%;
            max-width: 100%;
            overflow-y: scroll;

            h1 {
              margin: 0;
            }
          `}
        >
          <Link href="/classes">Back</Link>
          <h1>{capitalize(cls)} polyomino</h1>
          <MDXRemote {...source} />
          <h2>Polyomino list</h2>
          <ClassList minos={getBoundaryFamilies(cls)} />
        </main>
      </div>
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

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // TODO typecheck
  const { class: cls } = params as any
  const source = fs.readFileSync(
    `${process.cwd()}/pages/classes/subpages/${cls}.mdx`,
    "utf-8",
  )
  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  })
  return { props: { class: unescapeClass(cls), source: mdxSource } }
}
