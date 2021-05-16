import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import { Polyomino } from "mino"
import MinoLink from "components/MinoLink"

export default function MinoList({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        > * {
          margin: 0.5rem;
        }
      `}
    >
      {minos.map((mino) => {
        const { stroke, fill } = getMinoColor(mino)
        return (
          <MinoLink
            to={`/catalog/${mino.toString()}`}
            key={mino.data}
            mino={mino}
            size={8}
            fill={fill}
            stroke={stroke}
          />
        )
      })}
    </div>
  )
}
