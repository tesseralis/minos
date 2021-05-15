import { capitalize } from "lodash"
import fs from "fs"
import type { GetStaticProps } from "next"
import Link from "next/link"
import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { minoClasses } from "mino"
import Layout from "components/Layout"
import { escapeClass } from "./classHelpers"

export default function ClassInfo({ class: cls, source }: any) {
  return (
    <Layout>
      <Link href="/classes">
        <a>Back</a>
      </Link>
      <h1>{capitalize(cls)} polyomino</h1>
      <MDXRemote {...source} />
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
