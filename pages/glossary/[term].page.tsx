import { GetStaticProps } from "next"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import GlossaryLayout from "./layout"
import { capitalize } from "lodash"
import { getTerms } from "./glossaryHelpers"

import fixedPolyomino from "./subpages/fixed-polyomino.mdx"
import freePolyomino from "./subpages/free-polyomino.mdx"

const pages: Record<string, any> = {
  "fixed-polyomino": fixedPolyomino,
  "free-polyomino": freePolyomino,
}

const Page: NextPageWithLayout<Props> = (({ term }: Props) => {
  const Text = pages[term]
  return (
    <div>
      <h1>{capitalize(term.replace("-", " "))}</h1>
      <Text />
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
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // TODO typecheck
  const { term } = params as any
  const terms = getTerms()
  return { props: { term, terms } }
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
