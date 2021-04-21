import React, { ReactNode } from "react"
import MinoSvg, { Props as MinoSvgProps } from "components/MinoSvg"
import Vector from "vector"

export interface Props extends Omit<MinoSvgProps, "coord" | "onClick"> {
  children?: ReactNode
}

/**
 * A single mino wrapped in a div aligning with its dimensions.
 */
export default React.memo(function MinoDiv({
  mino,
  size,
  children,
  ...props
}: Props) {
  const [width, height] = mino.dims

  const svgWidth = width * size + 2
  const svgHeight = height * size + 2

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`${-svgWidth / 2} ${-svgHeight / 2} ${svgWidth} ${svgHeight}`}
    >
      <MinoSvg {...props} mino={mino} size={size} coord={Vector.ZERO} />
      {children}
    </svg>
  )
})
