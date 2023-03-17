import { css } from "@emotion/react"
import Layout from "components/Layout"
import Logo from "components/Logo"
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

            h1 {
              text-align: center;
              font-size: 3rem;
              padding: 1.5rem;
            }

            font-size: 1.25rem;
          `}
        >
          <Text />
          <div
            css={css`
              display: flex;
              justify-content: center;
              margin-bottom: 2rem;
              svg {
                width: 100px;
              }
            `}
          >
            <Logo />
          </div>
        </div>
      </div>
    </Layout>
  )
}
