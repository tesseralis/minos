import fs from "fs"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { GetStaticProps } from "next"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import GlossaryLayout from "./layout"
import { capitalize } from "lodash"

const Page: NextPageWithLayout = (({ term, source }: Props) => {
  return (
    <div>
      <h1>{capitalize(term.replace("-", " "))}</h1>
      <MDXRemote {...source} />
    </div>
  )
}) as any

Page.getLayout = function getLayout(page: ReactElement) {
  return <GlossaryLayout>{page}</GlossaryLayout>
}

export default Page

interface Props {
  term: string
  source: MDXRemoteSerializeResult
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // TODO typecheck
  const { term } = params as any
  const source = fs.readFileSync(
    `${process.cwd()}/pages/glossary/subpages/${term}.mdx`,
    "utf-8",
  )
  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  })
  return { props: { term, source: mdxSource } }
}

export function getStaticPaths() {
  const terms = fs.readdirSync(`${process.cwd()}/pages/glossary/subpages`)
  return {
    paths: terms.map((term) => ({
      params: { term: term.replace(".mdx", "") },
    })),
    fallback: false,
  }
}
