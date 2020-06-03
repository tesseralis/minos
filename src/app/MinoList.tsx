import React from "react"
import { css } from "emotion"

import { Mino, getSize, getShape, transform } from "mino"
import { colors } from "style/theme"
import { canonicalEquals, nodes, sortMinos, getMinoColor } from "./graph"
// FIXME make this a utility
import transition from "app/FamilyTree/transition"

import SelectableMino from "./SelectableMino"
const START_GENS = 5

interface ListMinoProps {
  mino: Mino
  isSelected: boolean
  onSelect(mino?: Mino): void
}

const ListMino = React.memo(function ({
  mino,
  isSelected,
  onSelect,
}: ListMinoProps) {
  mino = transform(mino, "flipMainDiag")
  const [height, width] = getShape(mino)

  const blockSize = 18 - getSize(mino)

  const svgWidth = width * blockSize * 1.25
  const svgHeight = height * blockSize * 1.25

  const { stroke, fill } = getMinoColor(mino)

  return (
    <div
      key={mino}
      className={css`
        margin-right: 1rem;
      `}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`${-svgWidth / 2} ${-svgHeight / 2} ${svgWidth} ${svgHeight}`}
      >
        <SelectableMino
          coord={[0, 0]}
          mino={mino}
          size={blockSize}
          onSelect={onSelect}
          stroke={isSelected ? colors.highlight : stroke}
          fill={fill}
        />
      </svg>
    </div>
  )
})

interface GenerationProps {
  minos: Mino[]
  selected?: Mino
  skipAnimation: boolean
  onSelect(mino?: Mino): void
}

const GenerationList = React.memo(function ({
  minos,
  skipAnimation,
  selected,
  onSelect,
}: GenerationProps) {
  const [visIndex, setVisIndex] = React.useState(0)
  React.useEffect(() => {
    if (skipAnimation) {
      return
    }
    transition({
      duration: minos.length * 5,
      onUpdate(val) {
        setVisIndex(val * minos.length)
      },
    })
  }, [minos, skipAnimation])

  return (
    <section
      className={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        :not(:first-child) {
          border-top: 1px ${colors.fg} solid;
        }
      `}
    >
      {sortMinos(minos).map((mino, i) => {
        if (!skipAnimation && i > visIndex) return null
        const isSelected = !!selected && canonicalEquals(mino, selected)
        return (
          <ListMino
            key={mino}
            mino={mino}
            onSelect={onSelect}
            isSelected={isSelected}
          />
        )
      })}
    </section>
  )
})

interface Props {
  selected?: Mino
  onSelect(mino?: Mino): void
}

// FIXME make sure ESC and clicking outside deselects
export default function MinoList({ selected, onSelect }: Props) {
  return (
    <main
      className={css`
        width: 100%;
        max-width: 48rem;
        margin-left: 10rem;
        height: 100vh;
        overflow-y: scroll;
      `}
    >
      {nodes.map((minos, i) => {
        const gen = i + 1
        const hasSelected = !!selected && getSize(selected) === gen
        return (
          <GenerationList
            minos={minos}
            key={gen}
            onSelect={onSelect}
            skipAnimation={gen <= START_GENS}
            selected={hasSelected ? selected : undefined}
          />
        )
      })}
    </main>
  )
}
