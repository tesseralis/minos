import { ReactNode } from "react"
import { css } from "@emotion/react"
import Nav from "./Nav"

interface Props {
  subNav?: ReactNode
  children: ReactNode
}

export default function Layout({ subNav, children }: Props) {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 10rem 1fr;
        position: fixed;
        width: 100%;
        height: 100%;
        padding: 0 2rem;
      `}
    >
      <div
        css={css`
          margin-top: 2rem;
        `}
      >
        <Nav />
        {subNav}
      </div>
      <div
        css={css`
          height: 100%;
          overflow-y: scroll;
        `}
      >
        {children}
      </div>
    </div>
  )
}
