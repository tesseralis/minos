import React from "react"
import { css } from "emotion"

import { getSize, getShape, transform } from "mino"
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
            display: flex;
            flex-wrap: wrap;
            margin: 2rem;
          `}
        >
          {sortMinos(minos).map((mino) => {
            mino = transform(mino, "rotateRight")
            const [height, width] = getShape(mino)

            const blockSize = 18 - getSize(mino)

            const svgWidth = width * blockSize * 1.125
            const svgHeight = height * blockSize * 1.125

            return (
              <div
                key={mino}
                className={css`
                  margin-right: 1rem;
                  margin-bottom: 1rem;
                `}
              >
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  viewBox={`${-svgWidth / 2} ${
                    -svgHeight / 2
                  } ${svgWidth} ${svgHeight}`}
                >
                  <SelectableMino
                    coord={[0, 0]}
                    mino={mino}
                    size={blockSize}
                    {...getMinoColor(mino)}
                  />
                </svg>
              </div>
            )
          })}
        </section>
      ))}
    </main>
  )
}
