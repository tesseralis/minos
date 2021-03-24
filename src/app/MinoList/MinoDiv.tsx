import React from "react"
import { css } from "@emotion/css"
import { scaleLinear } from "d3-scale"

import { NUM_GENERATIONS } from "app/graph"
import MinoSvg, { Props as MinoSvgProps } from "app/MinoSvg"
import Vector from "vector"

const getBlockSize = scaleLinear().domain([1, NUM_GENERATIONS]).range([18, 10])

type Props = Omit<MinoSvgProps, "coord" | "size">

/**
 * A single mino wrapped in a div aligning with its dimensions.
 */
export default React.memo(function MinoDiv({ mino, onClick, ...props }: Props) {
  const [width, height] = mino.dims
  const blockSize = getBlockSize(mino.order)

  const svgWidth = width * blockSize * 1.25
  const svgHeight = height * blockSize * 1.25

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
        onClick={onClick}
        tabIndex={0}
        className={css`
          :hover {
            cursor: pointer;
          }
        `}
      >
        <MinoSvg {...props} mino={mino} size={blockSize} coord={Vector.ZERO} />
      </svg>
    </div>
  )
})
