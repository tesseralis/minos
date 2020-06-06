import React from "react"
import { css } from "emotion"

import { Polyomino } from "mino"
import transition from "app/transition"

import GenSection from "./GenSection"
import MinoDiv from "./MinoDiv"

interface Props {
  minos: Polyomino[]
  gen: number
  selected: Polyomino | null
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
    const trans = transition({
      duration: minos.length * 5,
      onUpdate(val) {
        setVisIndex(val * minos.length)
      },
    })
    return () => trans.cancel()
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
        {Polyomino.sort(minos).map((mino, i) => {
          if (!skipAnimation && i > visIndex) return null
          const isSelected = !!selected && mino.equivalent(selected)
          return <MinoDiv key={mino.data} mino={mino} isSelected={isSelected} />
        })}
      </div>
    </GenSection>
  )
})
