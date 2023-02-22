import { GetStaticProps } from "next"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import { getTerms } from "./glossaryHelpers"
import Info from "./Info.mdx"
import GlossaryLayout from "./layout"

const Page: NextPageWithLayout<Props> = () => {
  return <Info />
}

Page.getLayout = function getLayout(page: ReactElement, pageProps: Props) {
  return <GlossaryLayout terms={pageProps.terms}>{page}</GlossaryLayout>
}

interface Props {
  terms: string[]
}

export const getStaticProps: GetStaticProps<Props> = () => {
  const terms = getTerms()
  return { props: { terms } }
}

export default Page
