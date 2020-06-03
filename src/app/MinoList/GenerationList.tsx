import React from "react"
import { css } from "emotion"

import { Mino } from "mino"
import { colors } from "style/theme"
import { canonicalEquals, sortMinos } from "app/graph"
import transition from "app/transition"

import MinoDiv from "./MinoDiv"

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

interface TitleProps {
  gen: number
}

function SectionTitle({ gen }: TitleProps) {
  return (
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
  )
}

interface Props {
  minos: Mino[]
  gen: number
  selected?: Mino
  skipAnimation: boolean
  onSelect(mino?: Mino): void
}

/**
 * A list of all polyominoes of a certain order.
 */
export default React.memo(function GenerationList({
  minos,
  gen,
  skipAnimation,
  selected,
  onSelect,
}: Props) {
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
      <SectionTitle gen={gen} />
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
            <MinoDiv
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
