import TilingLayout, { TilingView } from "./TilingLayout"
import { useRouter } from "next/router"
import { Polyomino } from "mino"
import { NextPageWithLayout } from "pages/_app.page"
import { ReactElement } from "react"

const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { mino = "1" } = router.query
  const polyomino = Polyomino.fromString(mino as any)
  return <TilingView mino={polyomino} />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <TilingLayout>{page}</TilingLayout>
}

export default Page
