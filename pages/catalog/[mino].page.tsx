import CatalogLayout, { MinoInfo } from "./CatalogLayout"
import { useRouter } from "next/router"
import { Polyomino } from "mino"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"

const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { mino } = router.query
  const polyomino = Polyomino.fromString(mino as any)
  return <MinoInfo mino={polyomino} />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <CatalogLayout>{page}</CatalogLayout>
}

export default Page
