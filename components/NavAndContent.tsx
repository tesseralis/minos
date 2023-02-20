import { ReactNode } from "react"
import { css } from "@emotion/react"
import Responsive from "./Responsive"
import { media } from "style/media"

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
        gap: 2rem;
        height: 100%;
        @media ${media.sm} {
          grid-template-columns: ${columns};
        }

        [data-matches="true"] {
          overflow-y: hidden;
        }
      `}
    >
      <Responsive
        query={media.sm}
        match={
          <nav
            css={css`
              height: 100%;
              overflow-y: scroll;
            `}
          >
            {nav}
          </nav>
        }
        default={null}
      />
      <main
        css={css`
          width: 100%;
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
