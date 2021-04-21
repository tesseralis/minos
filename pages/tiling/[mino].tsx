import TilingPage from "components/TilingPage"
import { useRouter } from "next/router"
import { Polyomino } from "mino"

export default function Page() {
  const router = useRouter()
  const { mino } = router.query
  return (
    <TilingPage
      mino={typeof mino === "string" ? Polyomino.fromString(mino) : undefined}
    />
  )
}
