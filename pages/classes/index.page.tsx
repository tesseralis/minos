import { ReactNode } from "react"
import ClassLayout from "./Layout"
import IndexText from "./IndexText.mdx"
import Breadcrumbs from "components/Breadcrumbs"

export default function Page() {
  return (
    <div>
      <Breadcrumbs paths={[["Classes", "/classes"]]} />
      <IndexText />
    </div>
  )
}

Page.getLayout = function getLayout(page: ReactNode) {
  return <ClassLayout>{page}</ClassLayout>
}
