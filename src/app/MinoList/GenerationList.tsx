import React from "react"
import { css } from "emotion"

import { Mino } from "mino"
import { canonicalEquals, sortMinos } from "app/graph"
import transition from "app/transition"

import GenSection from "./GenSection"
import MinoDiv from "./MinoDiv"

interface Props {
  minos: Mino[]
  gen: number
  selected: Mino | null
  skipAnimation: boolean
}

/**
 * A list of all polyominoes of a certain order.
 */
export default React.memo(function GenerationList({
  minos,
  gen,
  skipAnimation,
  selected,
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
    <GenSection gen={gen}>
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
          return <MinoDiv key={mino} mino={mino} isSelected={isSelected} />
        })}
      </div>
    </GenSection>
  )
})
