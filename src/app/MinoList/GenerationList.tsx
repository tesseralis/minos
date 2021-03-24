import React from "react"
import { css } from "@emotion/css"

import { Polyomino } from "mino"
import transition from "app/transition"
import { getMinoColor } from "app/graph"
import { colors } from "style/theme"

import GenSection from "./GenSection"
import MinoDiv from "./MinoDiv"

interface Props {
  minos: Polyomino[]
  gen: number
  selected: Polyomino | null
  onSelect(mino: Polyomino): void
  skipAnimation: boolean
  narrow?: boolean
}

/**
 * A list of all polyominoes of a certain order.
 */
export default React.memo(function GenerationList({
  minos,
  gen,
  skipAnimation,
  onSelect,
  selected,
  narrow,
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
    <GenSection gen={gen} narrow={narrow}>
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
          const { stroke, fill } = getMinoColor(mino)
          return (
            <MinoDiv
              key={mino.data}
              mino={
                // TODO (refactor) where's the right place to do this flip?
                mino.transform("flipMainDiag")
              }
              fill={fill}
              stroke={isSelected ? colors.highlight : stroke}
              onClick={() => onSelect(mino)}
            />
          )
        })}
      </div>
    </GenSection>
  )
})
