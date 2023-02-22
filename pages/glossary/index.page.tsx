import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import Info from "./Info.mdx"
import GlossaryLayout from "./layout"

const Page: NextPageWithLayout = () => {
  return <Info />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <GlossaryLayout>{page}</GlossaryLayout>
}

export default Page
