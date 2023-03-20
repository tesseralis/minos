import { ReactNode } from "react"
import { css } from "@emotion/react"
import Nav from "./Nav"
import * as Tooltip from "@radix-ui/react-tooltip"
import { media } from "style/media"

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <div
        css={css`
          display: grid;
          position: fixed;
          width: 100vw;
          height: 100vh;

          grid-template-rows: 48px 1fr;

          @media ${media.lg} {
            grid-template-columns: 10rem 1fr;
            grid-template-rows: 1fr;
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
        </div>
        <div
          css={css`
            width: 100%;
            height: 100%;
            overflow-y: scroll;
          `}
        >
          {children}
        </div>
      </div>
    </Tooltip.Provider>
  )
}
