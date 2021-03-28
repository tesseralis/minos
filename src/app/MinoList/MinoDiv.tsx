import React from "react"
import { css } from "@emotion/css"
import MinoSvg, { Props as MinoSvgProps } from "app/MinoSvg"
import Vector from "vector"

type Props = Omit<MinoSvgProps, "coord">

/**
 * A single mino wrapped in a div aligning with its dimensions.
 */
export default React.memo(function MinoDiv({
  mino,
  size,
  onClick,
  ...props
}: Props) {
  const [width, height] = mino.dims

  const svgWidth = width * size * 1.25
  const svgHeight = height * size * 1.25

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
        <MinoSvg {...props} mino={mino} size={size} coord={Vector.ZERO} />
      </svg>
    </div>
  )
})
