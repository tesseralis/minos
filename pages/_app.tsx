import "sanitize.css"
import "../src/style/a11y.css"
import "../src/style/theme.css"

// FIXME why doesn't it ask for types?
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
