import { ReactElement } from "react"
import SymmetryLayout from "./Layout"
import IndexText from "./IndexText.mdx"

export default function Page() {
  return <IndexText />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <SymmetryLayout>{page}</SymmetryLayout>
}
