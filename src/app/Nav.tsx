import React from "react"
import { NavLink } from "react-router-dom"
import { css } from "emotion"

import { colors } from "style/theme"

export default function Nav() {
  return (
    <nav
      className={css`
        font-family: serif;
      `}
    >
      <h1
        className={css`
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          color: ${colors.highlight};
          font-size: 2.25rem;
        `}
      >
        <span
          className={css`
            margin-left: 0.0625rem;
            font-size: 1rem;
          `}
        >
          labyrinth of
        </span>
        <span>minos</span>
      </h1>
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
