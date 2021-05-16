import { capitalize } from "lodash"
import fs from "fs"
import type { GetStaticProps } from "next"
import Link from "next/link"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { css } from "@emotion/react"
import { minoClasses } from "mino"
import Layout from "components/Layout"
import { classInfo, escapeClass } from "./classHelpers"

function ClassLinks() {
  return (
    <nav>
      {classInfo.map((info) => {
        return (
          <div key={info.name}>
            <Link href={`/classes/${escapeClass(info.name)}`}>
              <a>{info.name}</a>
            </Link>
          </div>
        )
      })}
    </nav>
  )
}

export default function ClassInfo({ class: cls, source }: any) {
  return (
    <Layout subNav={<ClassLinks />}>
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
  // FIXME how not to do this escape and unescape
  return { props: { class: cls.replace(/-/g, " "), source: mdxSource } }
}
