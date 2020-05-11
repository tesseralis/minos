import React, { memo, useState } from "react"
import { css } from "emotion"

import type { Mino } from "mino/mino"

import InfoButton from "./InfoButton"
import Compass from "./Compass"

import FullGraph from "./FullGraph"

export default memo(function MinoGraph() {
  const [selected, setSelected] = useState<Mino | undefined>()
  // const [hovered, setHovered] = useState<Mino | undefined>()

  return (
    <div
      className={css`
        display: grid;
        width: 100%;
        height: 100%;
      `}
    >
      <div
        className={css`
          grid-area: 1 / 1;
        `}
      >
        <FullGraph selected={selected} onSelect={setSelected} />
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
})
