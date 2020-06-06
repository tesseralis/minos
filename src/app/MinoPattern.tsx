import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import { parsePattern } from "mino/pattern"
import MinoSvg from "app/MinoSvg"
import { getMinoColor } from "app/graph"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { colors } from "style/theme"
const patternStr = require("!!raw-loader!data/7-rect.txt")

const blockSize = 20
const pattern = parsePattern(patternStr.default)

function PatternMino({ mino, coord: [x, y] }: any) {
  const selected = useSelected()
  const setSelected = useSetSelected()
  const [hovered, setHovered] = React.useState(false)
  let { fill } = getMinoColor(mino)
  fill = tinycolor(fill).saturate(20).toString()
  const isSelected = !!selected && mino.equivalent(selected)
  return (
    <MinoSvg
      mino={mino}
      coord={[x * blockSize, y * blockSize]}
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
}

export default function MinoPattern() {
  // FIXME add this to the grid metadata
  const grid = (patternStr.default as string)
    .trim()
    .split("\n")
    .map((row) => [...row])
  const width = grid[0].length
  const height = grid.length

  const blockWidth = width * blockSize
  const blockHeight = height * blockSize

  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      `}
    >
      <div
        className={css`
          margin: 2rem 0;
        `}
      >
        <svg width={blockWidth} height={blockHeight}>
          {pattern.map(({ mino, coord }) => (
            <PatternMino key={mino.data} mino={mino} coord={coord} />
          ))}
        </svg>
      </div>
    </div>
  )
}
