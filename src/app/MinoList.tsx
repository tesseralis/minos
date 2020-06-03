import React from "react"
import { css } from "emotion"

import { nodes, sortMinos, getMinoColor } from "./graph"

import SelectableMino from "./SelectableMino"

export default function MinoList() {
  return (
    <main
      className={css`
        width: 100%;
        max-width: 54rem;
        margin-left: 8rem;
        height: 100vh;
        overflow-y: scroll;
      `}
    >
      {nodes.map((minos, i) => (
        <section
          key={i}
          className={css`
            margin: 2rem;
          `}
        >
          {sortMinos(minos).map((mino) => (
            <span
              key={mino}
              className={css`
                margin-right: 1rem;
                margin-bottom: 1rem;
              `}
            >
              <svg width={50} height={50}>
                <SelectableMino
                  coord={[0, 0]}
                  mino={mino}
                  size={10}
                  anchor="top left"
                  {...getMinoColor(mino)}
                />
              </svg>
            </span>
          ))}
        </section>
      ))}
    </main>
  )
}
