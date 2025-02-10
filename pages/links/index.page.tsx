import { css } from "@emotion/react"
import Layout from "components/Layout"
import Text from "./Text.mdx"

export default function IntroPage() {
  return (
    <Layout>
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <div
          css={css`
            max-width: 800px;
            width: 100%;
            padding: 1rem;
          `}
        >
          <Text />
        </div>
      </div>
    </Layout>
  )
}
