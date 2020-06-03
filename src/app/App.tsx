import React, { useState } from "react"
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import { css } from "emotion"

import { Mino } from "mino"

import { getCanonical } from "./graph"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import FamilyTree from "./FamilyTree"
import MinoList from "./MinoList"

export default function App() {
  const [selected, setSelected] = useState<Mino | undefined>()

  return (
    <BrowserRouter>
      <div
        className={css`
          display: grid;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          /* Needed to make the graph full-height in Safari */
          width: 100%;
          height: 100%;
        `}
      >
        <div
          className={css`
            grid-area: 1 / 1;
            /* Needed to make the graph full-height in Safari */
            display: flex;
          `}
        >
          <Routes>
            <Route
              path="/"
              element={
                <FamilyTree
                  selected={selected && getCanonical(selected)}
                  onSelect={setSelected}
                />
              }
            />
            <Route
              path="/list"
              element={<MinoList selected={selected} onSelect={setSelected} />}
            />
          </Routes>
        </div>
        <nav
          className={css`
            grid-area: 1/1;
            align-self: start;
            justify-self: start;
            padding: 2rem;
          `}
        >
          <ul>
            {["graph", "list"].map((view) => (
              <li key={view}>
                {/* TODO make this a link with a router */}
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
        <div
          className={css`
            grid-area: 1 / 1;
            align-self: end;
            justify-self: start;
            padding: 2rem;
          `}
        >
          <InfoButton />
        </div>
        {selected && (
          <div
            key={selected}
            className={css`
              grid-area: 1 / 1;
              align-self: start;
              justify-self: end;
              padding: 2rem;
              pointer-events: none;
            `}
          >
            <Compass mino={selected} onSelect={setSelected} />
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}
