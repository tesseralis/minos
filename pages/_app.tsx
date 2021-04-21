import type { AppProps } from "next/app"
import "sanitize.css"
import "../src/style/a11y.css"
import "../src/style/theme.css"

import Layout from "../src/app/Layout"
import Nav from "../src/app/Nav"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout topLeft={<Nav />}>
      <Component {...pageProps} />
    </Layout>
  )
}
