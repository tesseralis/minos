import { ReactNode } from "react"
import { css } from "@emotion/react"
import Nav from "./Nav"

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 12rem 1fr;
        position: fixed;
        width: 100%;
        height: 100%;

        > nav {
          margin-left: 2rem;
          margin-top: 2rem;
        }
      `}
    >
      <Nav />
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
