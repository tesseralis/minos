import React, { useState } from "react"
import { css } from "emotion"

import type { Mino } from "mino/mino"

import { getCanonical } from "./graph"
import InfoButton from "./InfoButton"
import Compass from "./Compass"
import MinoGraph from "./MinoGraph"

export default function App() {
  const [selected, setSelected] = useState<Mino | undefined>()
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
      `}
    >
      <div
        className={css`
          grid-area: 1 / 1;
        `}
      >
        <MinoGraph
          selected={selected && getCanonical(selected)}
          onSelect={setSelected}
        />
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