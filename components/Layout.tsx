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
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        /* Needed to make the content full-height in Safari */
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
          position: relative;
        `}
      >
        {children}
      </div>
    </div>
  )
}
