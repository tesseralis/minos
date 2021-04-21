import tinycolor from "tinycolor2"
import React from "react"
import MinoSvg from "app/MinoSvg"
import { getMinoColor } from "app/graph"
import { Polyomino } from "mino"
import Vector from "vector"

interface Props {
  blockSize: number
  mino: Polyomino
  coord: Vector
  isSelected: boolean
}

export default React.memo(function PatternMino({
  blockSize,
  mino,
  coord,
}: Props) {
  const { fill } = getMinoColor(mino)
  let baseFill = tinycolor(fill)
  baseFill =
    mino.transform.symmetry() === "none"
      ? baseFill.saturate(40)
      : baseFill.desaturate(20)
  return (
    <MinoSvg
      mino={mino}
      coord={coord.scale(blockSize)}
      anchor="top left"
      size={blockSize}
      fill={baseFill.toString()}
      stroke="black"
      gridStyle="thin"
    />
  )
})
