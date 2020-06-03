import React, { useState } from "react"
import { css } from "emotion"

import { Mino } from "mino"

import { getCanonical } from "./graph"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import FamilyTree from "./FamilyTree"
import MinoList from "./MinoList"

const views = ["graph", "list"] as const
type View = "graph" | "list"

export default function App() {
  const [selected, setSelected] = useState<Mino | undefined>()
  // TODO replace this with a router
  const [view, setView] = useState<View>("list")

  return (
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
        {view === "graph" && (
          <FamilyTree
            selected={selected && getCanonical(selected)}
            onSelect={setSelected}
          />
        )}
        {view === "list" && (
          <MinoList selected={selected} onSelect={setSelected} />
        )}
      </div>
      <ul
        className={css`
          grid-area: 1/1;
          align-self: start;
          justify-self: start;
          padding: 2rem;
        `}
      >
        {views.map((view) => (
          <li key={view}>
            {/* TODO make this a link with a router */}
            <button
              className={css`
                font-family: serif;
                cursor: pointer;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                :hover {
                  color: gray;
                  text-decoration: underline;
                }
              `}
              onClick={() => setView(view)}
            >
              {view}
            </button>
          </li>
        ))}
      </ul>
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
  )
}
