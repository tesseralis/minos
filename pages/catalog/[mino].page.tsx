import CatalogLayout, { MinoInfo } from "./CatalogLayout"
import { useRouter } from "next/router"
import { Polyomino } from "mino"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"
import Breadcrumbs from "components/Breadcrumbs"
import MinoDiv from "components/MinoDiv"

const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { mino = "1" } = router.query
  const polyomino = Polyomino.fromString(mino as any)
  const minoDiv = (
    <MinoDiv
      mino={polyomino}
      size={Math.min(30 / polyomino.height, 15)}
      fill="none"
      stroke="currentcolor"
    />
  )
  return (
    <div>
      <Breadcrumbs
        paths={[
          ["Catalog", "/catalog"],
          [minoDiv, `/catalog/${mino}`],
        ]}
      />
      <MinoInfo mino={polyomino} />
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <CatalogLayout>{page}</CatalogLayout>
}

export default Page
