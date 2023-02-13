import Link from "next/link"
import { useRouter } from "next/router"
import { css } from "@emotion/react"

import { colors } from "style/theme"
import { media } from "style/media"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import * as NavMenu from "@radix-ui/react-navigation-menu"

export default function Nav() {
  const [showSidebar, setShowSidebar] = useState(true)

  const updateSidebar = useCallback((e: any) => {
    return setShowSidebar(e.matches)
  }, [])

  // FIXME are you supposed to use `useLayoutEffect here?`
  // There's still a FOUC on initial page load
  // https://stackoverflow.com/a/70219419
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const sidebarWatcher = window.matchMedia(media.lg)
      sidebarWatcher.addEventListener("change", updateSidebar)
      setShowSidebar(sidebarWatcher.matches)
      // if (sidebarWatcher.matches) {
      //   setShowSidebar(true)
      // }
      return () => sidebarWatcher.removeEventListener("change", updateSidebar)
    }
  }, [updateSidebar])

  return showSidebar ? <DesktopNav /> : <MobileNav />
}

function DesktopNav() {
  const router = useRouter()
  return (
    <nav
      css={css`
        display: none;
        font-family: serif;
        margin-left: 2rem;

        @media ${media.lg} {
          display: block;
        }
      `}
    >
      <Title />
      <ul>
        {navLinks.map((view) => (
          <li key={view}>
            <Link
              href={`/${view}`}
              passHref
              css={css`
                font-size: 1.25rem;
                line-height: 1.25;
                color: ${router.asPath.startsWith(`/${view}`)
                  ? colors.highlight
                  : colors.fg};

                text-decoration: none;
                :hover {
                  text-decoration: underline;
                }
              `}
            >
              {view}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Title() {
  return (
    <Link
      href="/"
      passHref
      css={css`
        display: flex;
        flex-direction: column;
        font-weight: normal;
        margin-top: 0;
        margin-bottom: 1rem;
        color: ${colors.highlight};
        line-height: 1;
        font-size: 1.5rem;
        text-decoration: none;

        span {
          margin-left: 0.0625rem;
          font-size: 1rem;
        }
      `}
    >
      <span>The labyrinth of</span>polyominoes
    </Link>
  )
}

function MobileNav() {
  const router = useRouter()
  return (
    <NavMenu.Root
      css={css`
        position: relative;
        display: flex;
        align-items: center;
        /* justify-content: center; */
        height: 3rem;
        width: 100vw;
        z-index: 1;
        border-bottom: 1px solid ${colors.fg};
      `}
    >
      <NavMenu.List
        css={css`
          display: flex;
          padding: 4px;
          border-radius: 6px;
          list-style: none;
          box-shadow: 0 2px 10px var(--blackA7);
          margin: 0;
        `}
      >
        <NavMenu.Item>
          <NavMenu.Trigger>Nav</NavMenu.Trigger>
          <NavMenu.Content
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              padding: 1rem;
            `}
          >
            {navLinks.map((view) => (
              <div key={view}>
                <NavMenu.Link asChild>
                  <Link
                    href={`/${view}`}
                    passHref
                    css={css`
                      font-size: 1.25rem;
                      line-height: 1.25;
                      color: ${router.asPath.startsWith(`/${view}`)
                        ? colors.highlight
                        : colors.fg};

                      text-decoration: none;
                      :hover {
                        text-decoration: underline;
                      }
                    `}
                  >
                    {view}
                  </Link>
                </NavMenu.Link>
              </div>
            ))}
          </NavMenu.Content>
        </NavMenu.Item>
      </NavMenu.List>
      <div
        css={css`
          position: absolute;
          display: flex;
          width: 100%;
          top: 100%;
          left: 0;
          perspective: 2000px;
        `}
      >
        <NavMenu.Viewport
          css={css`
            position: relative;
            transform-origin: top left;
            margin-top: 10px;
            width: 8rem;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid ${colors.fg};
            background-color: ${colors.bg};
            height: var(--radix-navigation-menu-viewport-height);
          `}
        />
      </div>
    </NavMenu.Root>
  )
}

export const navLinks = [
  "catalog",
  "symmetry",
  "classes",
  "packing",
  "tiling",
  "genealogy",
]
