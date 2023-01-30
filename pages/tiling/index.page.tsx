import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import Info from "./Info.mdx"
import TilingLayout from "./TilingLayout"

const Page: NextPageWithLayout = () => {
  return <Info />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <TilingLayout>{page}</TilingLayout>
}

export default Page
