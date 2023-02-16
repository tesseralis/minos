import { ReactNode } from "react"
import { css } from "@emotion/react"
import Nav from "./Nav"
import * as Tooltip from "@radix-ui/react-tooltip"
import { media } from "style/media"

interface Props {
  subNav?: ReactNode
  children: ReactNode
}

export default function Layout({ subNav, children }: Props) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <div
        css={css`
          /* grid-template-columns: 1fr; */
          position: fixed;
          width: 100vw;
          height: 100vh;
          /* padding: 0 2rem; */

          @media ${media.lg} {
            display: grid;
            grid-template-columns: 10rem 1fr;
          }
        `}
      >
        <div
          css={css`
            @media ${media.lg} {
              margin-top: 2rem;
            }
          `}
        >
          <Nav />
          {subNav}
        </div>
        <div
          css={css`
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            padding: 0 2rem;
          `}
        >
          {children}
        </div>
      </div>
    </Tooltip.Provider>
  )
}
