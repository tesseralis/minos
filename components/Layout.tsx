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
        grid-template-columns: 10rem 1fr;
        position: fixed;
        width: 100%;
        height: 100%;
        padding: 0 2rem;

        > nav {
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
