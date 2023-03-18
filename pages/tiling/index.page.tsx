import Breadcrumbs from "components/Breadcrumbs"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import Info from "./Info.mdx"
import TilingLayout from "./TilingLayout"

const Page: NextPageWithLayout = () => {
  return (
    <div>
      <Breadcrumbs paths={[["Tiling", "/tiling"]]} />
      <Info />
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <TilingLayout>{page}</TilingLayout>
}

export default Page
