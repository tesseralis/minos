import React from "react"
import { Link, NavLink } from "react-router-dom"
import { css } from "@emotion/react"

import { colors } from "style/theme"

function Title() {
  return (
    <Link
      to="/"
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
    </Link>
  )
}

export default function Nav() {
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
              <NavLink
                to={`/${view}`}
                css={css`
                  font-size: 1.25rem;
                  line-height: 1.25;

                  text-decoration: none;
                  :hover {
                    text-decoration: underline;
                  }
                `}
                activecss={css`
                  color: ${colors.highlight};
                `}
              >
                {view}
              </NavLink>
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
