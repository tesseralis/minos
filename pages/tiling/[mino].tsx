import TilingPage from "../../src/app/TilingPage"
import { useRouter } from "next/router"
import { Polyomino } from "../../src/mino"

export default function Page() {
  const router = useRouter()
  const { mino } = router.query
  return <TilingPage mino={mino && Polyomino.fromString(mino as any)} />
}
