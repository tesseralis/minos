import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import { parsePattern } from "mino/pattern"
import MinoSvg from "app/MinoSvg"
import { getMinoColor } from "app/graph"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { colors } from "style/theme"

// FIXME maybe it's better if we just use public for this
async function getPatternStr(patName: string): Promise<string> {
  const module = await import(`!!raw-loader!data/${patName}.txt`)
  return module.default
}

const patterns = [
  "1_4-rect",
  "1_4-square",
  "5-rect",
  "5-square",
  "6-rect",
  "6-square",
  "7-rect",
  "7-square",
  "8-square",
]

function PatternMino({ blockSize, mino, coord: [x, y] }: any) {
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

const maxWidth = 600

function MinoPattern({ patName }: any) {
  const [patternStr, setPatternStr] = React.useState<string | null>(null)

  React.useEffect(() => {
    getPatternStr(patName).then((str) => setPatternStr(str))
  }, [patName])
  if (!patternStr) return <div>Loading...</div>
  // const patternStr = getPatternStr(patName)
  const pattern = parsePattern(patternStr)
  // FIXME add this to the grid metadata
  const grid = patternStr
    .trim()
    .split("\n")
    .map((row) => [...row])

  const width = grid[0].length
  const height = grid.length
  const blockSize = Math.min(maxWidth / width, 40)

  const blockWidth = width * blockSize
  const blockHeight = height * blockSize
  return (
    <svg width={blockWidth} height={blockHeight}>
      {pattern.map(({ mino, coord }) => (
        <PatternMino
          key={mino.data}
          mino={mino}
          coord={coord}
          blockSize={blockSize}
        />
      ))}
    </svg>
  )
}

export default function PatternPage() {
  // FIXME make this navigation
  const [patName, setPatName] = React.useState(patterns[0])

  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <nav
        className={css`
          margin-top: 2rem;
        `}
      >
        {patterns.map((patName) => (
          <button key={patName} onClick={() => setPatName(patName)}>
            {patName}
          </button>
        ))}
      </nav>
      <div
        className={css`
          margin: 2rem 0;
        `}
      >
        <MinoPattern patName={patName} />
      </div>
    </div>
  )
}
