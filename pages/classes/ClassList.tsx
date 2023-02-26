import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import MinoLink from "components/MinoLink"
import { DirClass, Polyomino } from "mino"
import { getBoundaryFamilies } from "./classHelpers"
import ClassMino from "./ClassMino"
import { BoundaryWord } from "./words"

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

function BoundaryFamily({
  family,
  minos,
}: {
  family: string
  minos: Polyomino[]
}) {
  return (
    <div
      css={css`
        border: 1px dimgray solid;
        padding: 1rem;
        border-radius: 1rem;
      `}
    >
      <BoundaryWord word={family} />
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
        `}
      >
        {minos.map((mino) => {
          return <ClassMino key={mino.data} mino={mino} size={12} />
        })}
      </div>
    </div>
  )
}
