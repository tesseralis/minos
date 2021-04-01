import React from "react"
import { css } from "@emotion/css"

import { Polyomino } from "mino"
import transition from "app/transition"
import { getMinoColor } from "app/graph"
import { colors } from "style/theme"
import { scaleLinear } from "d3-scale"
import { NUM_GENERATIONS } from "app/graph"
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

const getBlockSize = scaleLinear().domain([1, NUM_GENERATIONS]).range([18, 10])

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
    <GenSection gen={gen} narrow={narrow} count={minos.length}>
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
            <div
              key={mino.data}
              className={css`
                margin: 0 0.5rem;
              `}
            >
              <MinoDiv
                mino={
                  // TODO (refactor) where's the right place to do this flip?
                  mino.transform("flipMainDiag")
                }
                fill={fill}
                size={getBlockSize(mino.order)}
                stroke={isSelected ? colors.highlight : stroke}
                onClick={() => onSelect(mino)}
              />
            </div>
          )
        })}
      </div>
    </GenSection>
  )
})
