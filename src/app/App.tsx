import React, { useState } from "react"
import { css } from "emotion"

import { Mino } from "mino"

import { getCanonical } from "./graph"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import MinoGraph from "./MinoGraph"
import MinoList from "./MinoList"

const views = ["graph", "list"] as const
type View = "graph" | "list"

export default function App() {
  const [selected, setSelected] = useState<Mino | undefined>()
  // TODO replace this with a router
  const [view, setView] = useState<View>("list")
  // const [hovered, setHovered] = useState<Mino | undefined>()

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
          <MinoGraph
            selected={selected && getCanonical(selected)}
            onSelect={setSelected}
          />
        )}
        {view === "list" && <MinoList />}
      </div>
      <div
        className={css`
          grid-area: 1/1;
          align-self: start;
          justify-self: start;
          padding: 2rem;
        `}
      >
        {views.map((view) => (
          <button key={view} onClick={() => setView(view)}>
            {view}
          </button>
        ))}
      </div>
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
