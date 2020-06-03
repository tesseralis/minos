import React from "react"
import { css } from "emotion"

import { Mino, getSize, getShape, transform } from "mino"
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
  mino = transform(mino, "rotateRight")
  const [height, width] = getShape(mino)

  const blockSize = 18 - getSize(mino)

  const svgWidth = width * blockSize * 1.125
  const svgHeight = height * blockSize * 1.125

  const { stroke, fill } = getMinoColor(mino)

  return (
    <div
      key={mino}
      className={css`
        margin-right: 1rem;
        margin-bottom: 1rem;
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
          stroke={isSelected ? "white" : stroke}
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
      duration: minos.length * 10,
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
        margin: 2rem;
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

export default function MinoList({ selected, onSelect }: Props) {
  return (
    <main
      className={css`
        width: 100%;
        max-width: 50rem;
        margin-left: 8rem;
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
