import React from "react"
import { css } from "emotion"
import { scaleLinear } from "d3-scale"

import { Polyomino } from "mino"
import { colors } from "style/theme"
import { NUM_GENERATIONS, getMinoColor } from "app/graph"
import SelectableMino from "app/SelectableMino"

const getBlockSize = scaleLinear().domain([1, NUM_GENERATIONS]).range([18, 10])

interface Props {
  mino: Polyomino
  isSelected: boolean
}

/**
 * A single mino wrapped in a div aligning with its dimensions.
 */
export default React.memo(function MinoDiv({ mino, isSelected }: Props) {
  mino = mino.transform("flipMainDiag")
  const width = mino.width()
  const height = mino.height()

  const blockSize = getBlockSize(mino.order)

  const svgWidth = width * blockSize * 1.25
  const svgHeight = height * blockSize * 1.25

  const { stroke, fill } = getMinoColor(mino)

  return (
    <div
      key={mino.data}
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
          stroke={isSelected ? colors.highlight : stroke}
          fill={fill}
        />
      </svg>
    </div>
  )
})
