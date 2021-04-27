import Head from "next/head"
import type { AppProps } from "next/app"
import "sanitize.css"
import "style/a11y.css"
import "style/theme.css"

import Layout from "components/Layout"
import Nav from "components/Nav"

// the default app
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>The Labyrinth of Polyominoes</title>
      </Head>
      <Layout topLeft={<Nav />}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
