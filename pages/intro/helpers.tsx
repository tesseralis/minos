import { css } from "@emotion/react"
import { Polyomino } from "mino"
import MinoLink from "components/MinoLink"
import { getMinoColor } from "components/graph"

const minos = [
  "1",
  "11",
  "010_111",
  "010_110_011",
  "110_101_111",
  "0010_1110_0111_0100",
]

export function MinoList() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        > * {
          margin: 0 0.5rem;
        }
      `}
    >
      {minos.map((minoStr) => {
        const mino = Polyomino.fromString(minoStr)
        return (
          <MinoLink
            key={minoStr}
            mino={mino}
            to={`catalog/${mino.transform.free()}`}
            size={10}
            {...getMinoColor(mino)}
          />
        )
      })}
    </div>
  )
}
