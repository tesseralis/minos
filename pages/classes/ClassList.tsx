import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import MinoLink from "components/MinoLink"
import { Polyomino } from "mino"

function BoundaryFamily({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border: 1px dimgray solid;
        padding: 0.5rem;
        border-radius: 1rem;

        > * {
          margin: 0.375rem;
        }
      `}
    >
      {minos.map((mino) => {
        const { stroke, fill } = getMinoColor(mino)
        return (
          <MinoLink
            key={mino.data}
            to={`/catalog/${mino.toString()}`}
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

export default function ClassList({ minos }: { minos: Polyomino[][] }) {
  return (
    <div
      css={css`
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
        margin: -0.5rem;

        > * {
          margin: 0.5rem;
        }
      `}
    >
      {minos.map((boundaryClass, key) => {
        return <BoundaryFamily minos={boundaryClass} key={key} />
      })}
    </div>
  )
}
