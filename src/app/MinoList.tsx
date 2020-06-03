import React from "react"
import { css } from "emotion"

import { Mino, getSize, getShape, transform } from "mino"
import { colors } from "style/theme"
import { canonicalEquals, nodes, sortMinos, getMinoColor } from "./graph"
import transition from "app/transition"
import useWindowEventListener from "app/useWindowEventListener"

import SelectableMino from "./SelectableMino"
const START_GENS = 5

const minoPrefixes = [
  "",
  "mono",
  "do",
  "tro",
  "tetro",
  "pento",
  "hexo",
  "hepto",
  "octo",
]

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
        margin: 0 0.5rem;
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
  gen: number
  selected?: Mino
  skipAnimation: boolean
  onSelect(mino?: Mino): void
}

const GenerationList = React.memo(function ({
  minos,
  gen,
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
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        :not(:first-child) {
          border-top: 1px ${colors.fg} solid;
        }
      `}
    >
      <h2
        className={css`
          color: ${colors.fg};
          font-size: 1.25rem;
          margin-bottom: 0.75rem;

          span {
            font-size: 0.875rem;
          }
        `}
      >
        {minoPrefixes[gen]}mino <span>(𝑛 = {gen})</span>
      </h2>
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
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
      </div>
    </section>
  )
})

interface Props {
  selected?: Mino
  onSelect(mino?: Mino): void
}

/**
 * Displays the list of all minos for each generation
 */
export default function MinoList({ selected, onSelect }: Props) {
  useWindowEventListener("click", (e) => {
    // Deselect the current mino if the click target isn't a mino
    // or the compass
    // TODO this is kind of a hack
    if (!(e.target instanceof SVGElement)) {
      onSelect()
    }
  })

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
            gen={gen}
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
