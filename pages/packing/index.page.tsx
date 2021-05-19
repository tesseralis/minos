import PackingLayout from "./PackingLayout"
import Info from "./Info.mdx"
import { css } from "@emotion/react"

export default function PackingPage() {
  return (
    <PackingLayout>
      <div
        css={css`
          margin: 2rem 4rem;
        `}
      >
        <Info />
      </div>
    </PackingLayout>
  )
}
