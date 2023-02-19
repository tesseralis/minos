import { ReactNode } from "react"
import { css } from "@emotion/react"

interface Props {
  nav: ReactNode
  children: ReactNode
  // grid template columns
  columns: string
}

/**
 * Represents a custom navigation and content that is side-to-side in desktop and as a popover sidebar on mobile.
 */
export default function NavAndContent({ nav, children, columns }: Props) {
  return (
    <div
      css={css`
        position: absolute;
        display: grid;
        grid-template-columns: ${columns};
        gap: 2rem;
        height: 100%;
      `}
    >
      <nav
        css={css`
          height: 100%;
          overflow-y: scroll;
        `}
      >
        {nav}
      </nav>
      <main
        css={css`
          height: 100%;
          padding: 2rem;
          overflow-y: scroll;
        `}
      >
        {children}
      </main>
    </div>
  )
}
