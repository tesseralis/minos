import React from "react"
import { css } from "@emotion/react"

import { Polyomino } from "mino"
import transition from "components/transition"
import { getMinoColor } from "components/graph"
import { colors } from "style/theme"
import { scaleLinear } from "d3-scale"
import { NUM_GENERATIONS } from "components/graph"
import GenSection from "./GenSection"
import MinoLink from "components/MinoLink"

const getBlockSize = scaleLinear().domain([1, NUM_GENERATIONS]).range([18, 10])

interface Props {
  minos: Polyomino[]
  gen: number
  selected: Polyomino | null
  to(mino: Polyomino): string
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
  to,
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
        css={css`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;

          > * {
            margin: 0.5rem;
          }
        `}
      >
        {minos.length === 0
          ? "——"
          : minos.map((mino, i) => {
              if (!skipAnimation && i > visIndex) return null
              const isSelected =
                !!selected && mino.transform.equivalent(selected)
              const { stroke, fill } = getMinoColor(mino)
              return (
                <MinoLink
                  key={mino.data}
                  mino={mino}
                  fill={fill}
                  stroke={isSelected ? colors.highlight : stroke}
                  size={getBlockSize(mino.order)}
                  to={to(mino)}
                />
              )
            })}
      </div>
    </GenSection>
  )
})
