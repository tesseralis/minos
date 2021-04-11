import React, { ReactNode } from "react"
import { css } from "@emotion/css"
import MinoSvg, { Props as MinoSvgProps } from "app/MinoSvg"
import Vector from "vector"

interface Props extends Omit<MinoSvgProps, "coord"> {
  children?: ReactNode
}

/**
 * A single mino wrapped in a div aligning with its dimensions.
 */
export default React.memo(function MinoDiv({
  mino,
  size,
  onClick,
  children,
  ...props
}: Props) {
  const [width, height] = mino.dims

  const svgWidth = width * size + 2
  const svgHeight = height * size + 2

  return (
    <div key={mino.data}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`${-svgWidth / 2} ${-svgHeight / 2} ${svgWidth} ${svgHeight}`}
        onClick={onClick}
        tabIndex={0}
        className={css`
          cursor: ${onClick ? "pointer" : "initial"};
        `}
      >
        <MinoSvg {...props} mino={mino} size={size} coord={Vector.ZERO} />
        {children}
      </svg>
    </div>
  )
})
