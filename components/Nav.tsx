import Link from "next/link"
import { useRouter } from "next/router"
import { css } from "@emotion/react"

import { colors } from "style/theme"
import { media } from "style/media"
import * as NavMenu from "@radix-ui/react-navigation-menu"
import Responsive from "./Responsive"
import Logo from "./Logo"
import { BsList } from "react-icons/bs"

export default function Nav() {
  return (
    <Responsive
      query={media.lg}
      match={<DesktopNav />}
      default={<MobileNav />}
    />
  )
}

function DesktopNav() {
  const router = useRouter()
  return (
    <nav
      css={css`
        font-family: serif;
        margin-left: 2rem;
      `}
    >
      <Title />
      <ul>
        {navLinks.map((view) => {
          const isActive = router.asPath.startsWith(`/${view}`)
          return (
            <li key={view}>
              <Link
                href={`/${view}`}
                passHref
                data-active={isActive}
                css={css`
                  font-size: 1.25rem;
                  line-height: 1.25;
                  color: ${colors.fg};
                  &[data-active="true"] {
                    color: ${colors.highlight};
                  }

                  text-decoration: none;
                  :hover {
                    text-decoration: underline;
                  }
                `}
              >
                {view}
              </Link>
            </li>
          )
        })}
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
        background: ${colors.bg};
        height: 3rem;
        width: 100vw;
        z-index: 1;
        border-bottom: 1px solid ${colors.border};
      `}
    >
      <NavMenu.List
        css={css`
          display: grid;
          padding: 4px;
          margin: 0;
          grid-template-columns: 2rem 1fr 2rem;
          justify-items: center;
          width: 100vw;
        `}
      >
        <NavMenu.Item>
          <NavMenu.Trigger
            css={css`
              background: none;
              border: none;
              color: ${colors.fg};
              font-family: serif;
              font-size: 1.25rem;
            `}
          >
            <BsList size={30} />
          </NavMenu.Trigger>
          <NavMenu.Content
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            `}
          >
            {navLinks.map((view) => {
              const isActive = router.asPath.startsWith(`/${view}`)
              return (
                <div key={view}>
                  <NavMenu.Link asChild>
                    <Link
                      href={`/${view}`}
                      passHref
                      data-active={isActive}
                      css={css`
                        display: block;
                        font-size: 1.25rem;
                        line-height: 1.25;
                        color: ${colors.fg};
                        &[data-active="true"] {
                          color: ${colors.highlight};
                        }
                        text-decoration: none;
                        padding: 0.25rem 1rem;

                        :hover {
                          background-color: ${colors.bg2};
                        }

                        @media (pointer: coarse) {
                          padding: 0.5rem 1rem;
                        }
                      `}
                    >
                      {view}
                    </Link>
                  </NavMenu.Link>
                </div>
              )
            })}
          </NavMenu.Content>
        </NavMenu.Item>
        <NavMenu.Item>
          <NavMenu.Link asChild>
            <Link
              href="/"
              css={css`
                svg {
                  width: 30px;
                }
              `}
            >
              <Logo />
            </Link>
          </NavMenu.Link>
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
            /* margin-top: 10px;
            width: 8rem; */
            /* border-radius: 6px; */
            overflow: hidden;
            /* border: 1px solid ${colors.border}; */
            border-top: 1px solid ${colors.border};
            border-bottom: 1px solid ${colors.border};
            background-color: ${colors.bg};
            height: var(--radix-navigation-menu-viewport-height);

            width: 100%;

            @media ${media.sm} {
              width: 8rem;
              border: 1px solid ${colors.border};
            }
          `}
        />
      </div>
    </NavMenu.Root>
  )
}

export const navLinks = [
  "intro",
  "catalog",
  "symmetry",
  "classes",
  "packing",
  "tiling",
  "genealogy",
  "glossary",
]
