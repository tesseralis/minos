import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import MinoDiv from "components/MinoDiv"
import { Polyomino } from "mino"

function BoundaryFamily({ minos }: { minos: Polyomino[] }) {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border: 1px grey solid;
        padding: 0.5rem;

        > * {
          margin: 0.375rem;
        }
      `}
    >
      {minos.map((mino) => {
        const { stroke, fill } = getMinoColor(mino)
        return (
          <MinoDiv
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

export default function ClassList({ minos }: { minos: Polyomino[][] }) {
  return (
    <div
      css={css`
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;

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
