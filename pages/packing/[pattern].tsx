import { useRouter } from "next/router"
import PackingPage from "components/PackingPage"

export default function Page() {
  const router = useRouter()
  const { pattern } = router.query
  console.log(pattern)
  return <PackingPage pattern={pattern as any} />
}
