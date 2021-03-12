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
  let { fill } = getMinoColor(mino)
  fill = tinycolor(fill).saturate(20).toString()
  return (
    <MinoSvg
      mino={mino}
      coord={coord.scale(blockSize)}
      anchor="top left"
      size={blockSize}
      fill={
        isSelected
          ? tinycolor.mix(fill, colors.highlight).toString()
          : hovered
          ? tinycolor.mix(fill, colors.highlight, 30).toString()
          : fill
      }
      stroke="black"
      hideInner
      onClick={() => setSelected(mino)}
      onHover={setHovered}
    />
  )
})
