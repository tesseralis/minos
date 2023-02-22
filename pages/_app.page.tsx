import React from "react"
import Head from "next/head"
import type { AppProps } from "next/app"
import "sanitize.css"
import "style/a11y.css"
import "style/theme.css"

import type { ReactElement, ReactNode } from "react"
import type { NextPage } from "next"

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, pageProps: P) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// the default app
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>The Labyrinth of Polyominoes</title>
      </Head>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </>
  )
}
