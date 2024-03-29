import { GetStaticProps } from "next"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import GlossaryLayout from "./layout"
import { capitalize } from "lodash"
import { getTerms } from "./glossaryHelpers"

import fixed from "./subpages/fixed.mdx"
import free from "./subpages/free.mdx"
import oneSided from "./subpages/one-sided.mdx"
import convex from "./subpages/convex.mdx"
import boundaryWord from "./subpages/boundary-word.mdx"
import puncture from "./subpages/puncture.mdx"
import hole from "./subpages/hole.mdx"
import orthogonallyDirected from "./subpages/orthogonally-directed.mdx"
import diagonallyDirected from "./subpages/diagonally-directed.mdx"

const pages: Record<string, any> = {
  fixed,
  free,
  "one-sided": oneSided,
  convex,
  "boundary-word": boundaryWord,
  hole,
  puncture,
  "orthogonally-directed": orthogonallyDirected,
  "diagonally-directed": diagonallyDirected,
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
