import { css } from "@emotion/react"
import { Polyomino } from "mino"
import MinoLink from "components/MinoLink"
import { getMinoColor } from "components/graph"
import { media } from "style/media"

const minos = [
  "1",
  "01_11",
  "010_111",
  "101_111",
  "110_101_111",
  "0010_1110_0111_0100",
]

export function MinoList() {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        @media ${media.sm} {
          gap: 2rem;
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
            size={15}
            {...getMinoColor(mino)}
          />
        )
      })}
    </div>
  )
}
