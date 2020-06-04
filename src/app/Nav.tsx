import React from "react"
import { NavLink } from "react-router-dom"
import { css } from "emotion"

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
        font-size: 2.25rem;

        span {
          margin-left: 0.0625rem;
          font-size: 1rem;
        }
      `}
    >
      <span>labyrinth of</span>
      minos
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
        {["graph", "list"].map((view) => (
          <li key={view}>
            <NavLink
              to={view === "graph" ? "/" : `/${view}`}
              className={css`
                font-size: 1.5rem;
                line-height: 1.25;

                color: ${colors.fg};
                text-decoration: none;
                :hover {
                  text-decoration: underline;
                }
              `}
              end
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
