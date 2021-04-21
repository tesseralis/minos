import type { AppProps } from "next/app"
import "sanitize.css"
import "style/a11y.css"
import "style/theme.css"

import Layout from "components/Layout"
import Nav from "components/Nav"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout topLeft={<Nav />}>
      <Component {...pageProps} />
    </Layout>
  )
}
