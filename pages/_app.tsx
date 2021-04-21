import "sanitize.css"
import "../src/style/a11y.css"
import "../src/style/theme.css"

import Layout from "../src/app/layout"
import Nav from "../src/app/Nav"

// FIXME why doesn't it ask for types?
export default function App({ Component, pageProps }) {
  return (
    <Layout topLeft={<Nav />}>
      <Component {...pageProps} />
    </Layout>
  )
}
