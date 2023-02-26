import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import MinoLink from "components/MinoLink"
import { DirClass, Polyomino } from "mino"
import { getBoundaryFamilies } from "./classHelpers"

function BoundaryFamily({
  family,
  minos,
}: {
  family: string
  minos: Polyomino[]
}) {
  // TODO include boundary families
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

export default function ClassList({ dirClass }: { dirClass: DirClass }) {
  const families = getBoundaryFamilies(dirClass.name())
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
      {families.map(({ family, minos }, key) => {
        return <BoundaryFamily family={family} minos={minos} key={key} />
      })}
    </div>
  )
}
