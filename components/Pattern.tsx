import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"

import { parsePattern } from "mino"
import transition from "components/transition"
import { useSelected } from "components/SelectedContext"
import tinycolor from "tinycolor2"
import { memo } from "react"
import MinoSvg from "components/MinoSvg"
import { getMinoColor } from "components/graph"
import { Polyomino } from "mino"
import Vector from "lib/vector"
import { css } from "@emotion/react"

interface MinoProps {
  blockSize: number
  mino: Polyomino
  coord: Vector
  isSelected: boolean
}

const PatternMino = memo(function PatternMino({
  blockSize,
  mino,
  coord,
}: MinoProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const { fill } = getMinoColor(mino)
  const baseFill = tinycolor(fill)
  return (
    <MinoSvg
      mino={mino}
      coord={coord.scale(blockSize)}
      anchor="top left"
      size={blockSize}
      fill={hovered ? baseFill.lighten().toString() : baseFill.toString()}
      stroke="black"
      gridStyle="thin"
      onHover={setHovered}
      onClick={() =>
        router.push(`/catalog/${mino.transform.free().toString()}`)
      }
    />
  )
})

// TODO maybe it's better if we just use /public for this
// async function getPatternStr(patName: string): Promise<string> {
//   const module = await import(`!!raw-loader!data/${patName}.txt`)
//   return module.default
// }

const maxWidth = 500

interface Props {
  pattern: string
}

export default function MinoPattern({ pattern: patternStr }: Props) {
  // const [patternStr, setPatternStr] = useState<string | null>(null)
  const [visIndex, setVisIndex] = useState(-1)
  const selected = useSelected()
  const pattern = useMemo(() => parsePattern(patternStr), [patternStr])

  // TODO de-duplicate with the other two animations
  const skipAnimation = pattern.length < 100
  useEffect(() => {
    if (skipAnimation) {
      return
    }
    const trans = transition({
      duration: pattern.length * 2,
      onUpdate(val) {
        setVisIndex(val * pattern.length)
      },
    })
    return () => trans.cancel()
  }, [pattern, skipAnimation])

  if (!patternStr) return null

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
    <svg
      viewBox={`0 0 ${blockWidth} ${blockHeight}`}
      css={css`
        overflow: visible;
        aspect-ratio: ${width} / ${height};
      `}
    >
      {pattern.map(({ mino, coord }, i) =>
        !skipAnimation && i > visIndex ? null : (
          <PatternMino
            key={mino.data}
            mino={mino}
            coord={coord}
            blockSize={blockSize}
            isSelected={!!selected && mino.transform.equivalent(selected)}
          />
        ),
      )}
    </svg>
  )
}
