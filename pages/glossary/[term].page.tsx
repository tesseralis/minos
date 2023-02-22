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
import { getTerms } from "./glossaryHelpers"

const Page: NextPageWithLayout<Props> = (({ term, source }: Props) => {
  return (
    <div>
      <h1>{capitalize(term.replace("-", " "))}</h1>
      <MDXRemote {...source} />
    </div>
  )
}) as any

Page.getLayout = function getLayout(page: ReactElement, pageProps: Props) {
  return <GlossaryLayout terms={pageProps.terms}>{page}</GlossaryLayout>
}

export default Page

interface Props {
  term: string
  terms: string[]
  source: MDXRemoteSerializeResult
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // TODO typecheck
  const { term } = params as any
  const terms = getTerms()
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
  return { props: { term, terms, source: mdxSource } }
}

export function getStaticPaths() {
  const terms = getTerms()
  return {
    paths: terms.map((term) => ({
      params: { term },
    })),
    fallback: false,
  }
}
