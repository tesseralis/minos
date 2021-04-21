import Link from "next/link"
import { useRouter } from "next/router"
import { css } from "@emotion/react"

import { colors } from "style/theme"

function Title() {
  return (
    <Link href="/">
      <a
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
        <span>The labyrinth of</span>
        polyominoes
      </a>
    </Link>
  )
}

export default function Nav() {
  const router = useRouter()
  return (
    <nav
      css={css`
        font-family: serif;
      `}
    >
      <Title />
      <ul>
        {["catalog", "packing", "tiling", "classes", "genealogy"].map(
          (view) => (
            <li key={view}>
              <Link href={`/${view}`}>
                <a
                  css={css`
                    font-size: 1.25rem;
                    line-height: 1.25;
                    color: ${router.pathname.startsWith(`/${view}`)
                      ? colors.highlight
                      : colors.fg};

                    text-decoration: none;
                    :hover {
                      text-decoration: underline;
                    }
                  `}
                >
                  {view}
                </a>
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
