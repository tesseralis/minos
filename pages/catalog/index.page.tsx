import CatalogLayout from "./CatalogLayout"
import Info from "./Info.mdx"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"

// export default Catalog

const Page: NextPageWithLayout = () => {
  return <Info />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <CatalogLayout>{page}</CatalogLayout>
}

export default Page
