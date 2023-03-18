import CatalogLayout from "./CatalogLayout"
import Info from "./Info.mdx"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import Breadcrumbs from "components/Breadcrumbs"

// export default Catalog

const Page: NextPageWithLayout = () => {
  return (
    <div>
      <Breadcrumbs paths={[["Catalog", "/catalog"]]} />
      <Info />
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <CatalogLayout>{page}</CatalogLayout>
}

export default Page
