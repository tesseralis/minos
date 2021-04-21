import CatalogPage from "app/CatalogPage"
import { useRouter } from "next/router"
import { Polyomino } from "mino"

export default function Page() {
  const router = useRouter()
  const { mino } = router.query
  return (
    <CatalogPage mino={mino ? Polyomino.fromString(mino as any) : undefined} />
  )
}
