import React from "react"
import { NavLink } from "react-router-dom"
import { css } from "@emotion/css"

import { colors } from "style/theme"

function Title() {
  return (
    <h1
      className={css`
        display: flex;
        flex-direction: column;
        font-weight: normal;
        margin-top: 0;
        margin-bottom: 1rem;
        color: ${colors.highlight};
        line-height: 1;
        font-size: 1.5rem;

        span {
          margin-left: 0.0625rem;
          font-size: 1rem;
        }
      `}
    >
      <span>The labyrinth of</span>
      polyominoes
    </h1>
  )
}

export default function Nav() {
  return (
    <nav
      className={css`
        font-family: serif;
      `}
    >
      <Title />
      <ul>
        {["list", "packing", "tiling", "genaeology"].map((view) => (
          <li key={view}>
            <NavLink
              to={`/${view}`}
              className={css`
                font-size: 1.25rem;
                line-height: 1.25;

                color: ${colors.fg};
                text-decoration: none;
                :hover {
                  text-decoration: underline;
                }
              `}
              activeClassName={css`
                color: ${colors.highlight};
              `}
            >
              {view}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
