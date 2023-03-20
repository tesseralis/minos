import { ReactNode, useCallback, useEffect, useState } from "react"
import { css } from "@emotion/react"
import Responsive from "./Responsive"
import { media } from "style/media"
import * as Dialog from "@radix-ui/react-dialog"
import { colors } from "style/theme"
import { Cross1Icon } from "@radix-ui/react-icons"
import { FaBars } from "react-icons/fa"
import { BsFillGrid3X3GapFill } from "react-icons/bs"

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
      style={{ gridTemplateColumns: columns }}
      css={css`
        height: 100%;
        @media ${media.sm} {
          display: grid;
          gap: 2rem;
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
        default={
          <MobileNavDialog
            content={
              <nav
                css={css`
                  height: 100%;
                  overflow-y: scroll;
                `}
              >
                {nav}
              </nav>
            }
          />
        }
      />
      <main
        css={css`
          width: 100%;
          height: 100%;
          padding: 2rem;
          overflow-y: scroll;
          margin-bottom: 4rem;
        `}
      >
        {children}
      </main>
    </div>
  )
}

interface DialogProps {
  content: ReactNode
}

const timeoutMs = 200

function MobileNavDialog({ content }: DialogProps) {
  const [state, setState] = useState<"open" | "pending" | "closed">("closed")
  const isOpen = state !== "closed"
  const onOpenChange = useCallback((open: boolean) => {
    setState("pending")
    setTimeout(() => {
      setState(open ? "open" : "closed")
    }, timeoutMs)
  }, [])

  useEffect(() => {
    const handler = (e: any) => {
      if (e.target?.closest("a")) {
        onOpenChange(false)
      }
    }
    // TODO work on keyboard as well
    window.addEventListener("click", handler)
    return () => window.removeEventListener("click", handler)
  }, [onOpenChange])
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger
        css={css`
          position: fixed;
          left: 0;
          bottom: 1rem;
          background: ${colors.bg};

          color: ${colors.fg};
          padding: 0.75rem;
          padding-right: 1rem;

          border: 1px solid ${colors.border};
          border-left: none;
          border-top-right-radius: 9999px;
          border-bottom-right-radius: 9999px;
        `}
      >
        <BsFillGrid3X3GapFill size={30} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          css={css`
            background-color: black;
            opacity: 25%;
          `}
        />
        <Dialog.Content
          data-state={state}
          css={css`
            background-color: ${colors.bg};
            position: fixed;
            height: 100vh;
            width: calc(100vw - 2rem);
            border-right: 1px solid ${colors.border};
            box-shadow: 2px 2px 8px #111;

            transition: transform ${timeoutMs}ms ease-in;

            &[data-state="pending"] {
              transform: translate(-100%);
            }

            &[data-state="open"] {
              transform: initial;
            }
          `}
        >
          {content}
          <Dialog.Close
            css={css`
              position: absolute;
              right: 1rem;
              top: 1rem;
              background: none;
              border: none;
              color: ${colors.fg};
            `}
          >
            <Cross1Icon />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
