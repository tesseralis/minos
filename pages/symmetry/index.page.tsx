import { ReactElement } from "react"
import SymmetryLayout from "./Layout"
import IndexText from "./IndexText.mdx"
import Breadcrumbs from "components/Breadcrumbs"

export default function Page() {
  return <IndexText />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <SymmetryLayout>
      <Breadcrumbs paths={[["Symmetry", "/symmetry"]]} />
      {page}
    </SymmetryLayout>
  )
}
