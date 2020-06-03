import React from "react"
import { NavLink } from "react-router-dom"
import { css } from "emotion"

export default function Nav() {
  return (
    <nav>
      <ul>
        {["graph", "list"].map((view) => (
          <li key={view}>
            <NavLink
              to={view === "graph" ? "/" : `/${view}`}
              className={css`
                font-family: serif;
                color: #aaa;
                font-size: 1.5rem;
                text-decoration: none;
                :hover {
                  text-decoration: underline;
                }
              `}
              end
              activeClassName={css`
                color: white;
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
