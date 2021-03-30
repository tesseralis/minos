import tinycolor from "tinycolor2"
import React from "react"
import { useSetSelected } from "app/SelectedContext"
import MinoSvg from "app/MinoSvg"
import { getMinoColor } from "app/graph"
import { colors } from "style/theme"
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
  isSelected,
}: Props) {
  const setSelected = useSetSelected()
  const [hovered, setHovered] = React.useState(false)
  const { fill } = getMinoColor(mino)
  let baseFill = tinycolor(fill)
  baseFill =
    mino.symmetry() === "none" ? baseFill.saturate(40) : baseFill.desaturate(20)
  return (
    <MinoSvg
      mino={mino}
      coord={coord.scale(blockSize)}
      anchor="top left"
      size={blockSize}
      fill={
        isSelected
          ? tinycolor.mix(baseFill, colors.highlight).toString()
          : hovered
          ? tinycolor.mix(baseFill, colors.highlight, 30).toString()
          : baseFill.toString()
      }
      stroke="black"
      gridStyle="thin"
      onClick={() => setSelected(mino)}
      onHover={setHovered}
    />
  )
})
