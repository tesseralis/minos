import { useState, useEffect, useMemo } from "react"

import { parsePattern } from "mino"
import transition from "components/transition"
import { useSelected } from "components/SelectedContext"
import PatternMino from "./PatternMino"

// TODO maybe it's better if we just use /public for this
async function getPatternStr(patName: string): Promise<string> {
  const module = await import(`!!raw-loader!data/${patName}.txt`)
  return module.default
}

const maxWidth = 500

interface Props {
  pattern: string
}

export default function MinoPattern({ pattern: patName }: Props) {
  const [patternStr, setPatternStr] = useState<string | null>(null)
  const [visIndex, setVisIndex] = useState(-1)
  const selected = useSelected()

  useEffect(() => {
    getPatternStr(patName).then((str) => setPatternStr(str))
  }, [patName])
  const pattern = useMemo(() => (patternStr ? parsePattern(patternStr) : []), [
    patternStr,
  ])

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
    <svg width={blockWidth} height={blockHeight}>
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
