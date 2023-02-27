import { memo } from "react"
import { css } from "@emotion/react"

import { Polyomino } from "mino"
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
}

/**
 * A list of all polyominoes of a certain order.
 */
export default memo(function GenerationList({
  minos,
  gen,
  to,
  selected,
}: Props) {
  return (
    <GenSection gen={gen} count={minos.length}>
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
