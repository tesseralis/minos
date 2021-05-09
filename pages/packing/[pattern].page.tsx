import { useRouter } from "next/router"
import PackingPage from "./PackingPage"

export default function Page() {
  const router = useRouter()
  const { pattern } = router.query
  return <PackingPage pattern={pattern as any} />
}
