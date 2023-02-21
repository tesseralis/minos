import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import { Polyomino } from "mino"
import MinoLink from "components/MinoLink"

export default function MinoList({ minos }: { minos: Polyomino[][] }) {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        gap: 1.75rem 1.75rem;
      `}
    >
      {minos.map((minos, gen) => {
        return (
          <div
            key={gen}
            css={css`
              display: flex;
              gap: 0.75rem;
            `}
          >
            {gen}
            <div
              css={css`
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 0.75rem;
                justify-content: space-between;

                ::after {
                  content: "";
                  flex: auto;
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
          </div>
        )
      })}
    </div>
  )
}
