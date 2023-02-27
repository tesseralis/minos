import { css } from "@emotion/react"
import { DirClass, Polyomino } from "mino"
import { useState } from "react"
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
        gap: 1rem;
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
  minos: Polyomino[][]
}) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  return (
    <div
      css={css`
        border: 1px dimgray solid;
        padding: 1.5rem;
        padding-right: 2rem;
        border-radius: 1rem;
        flex-grow: 1;
      `}
    >
      <BoundaryWord
        word={family}
        currentIndex={currentIndex}
        onChangeIndex={setCurrentIndex}
      />
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          gap: 2.5rem 1.5rem;
        `}
      >
        {minos.map((gen, index) => {
          return (
            <div
              key={index}
              css={css`
                flex-grow: 1;
                display: flex;
                gap: 0.75rem;
              `}
            >
              <div>{index}</div>
              <div
                css={css`
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  gap: 1.25rem;

                  justify-content: space-between;

                  ::after {
                    content: "";
                    flex: auto;
                  }
                `}
              >
                {gen.map((mino) => {
                  return (
                    <ClassMino
                      key={mino.data}
                      mino={mino}
                      size={12}
                      currentIndex={currentIndex}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
