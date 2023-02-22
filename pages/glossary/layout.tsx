import Layout from "components/Layout"
import { ReactElement, ReactNode } from "react"

interface Props {
  children: ReactElement
}

export default function GlossaryLayout({ children }: Props) {
  return <Layout>{children}</Layout>
}
