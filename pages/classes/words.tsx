import { css } from "@emotion/react"
import { chunk } from "lodash"
import { DirClass } from "mino"
import { colors } from "style/theme"

interface WordProps {
  word: string
  currentIndex: number
  onChangeIndex(index: number): void
}

// TODO have similar behavior for touch devices
export function BoundaryWord({ word, currentIndex, onChangeIndex }: WordProps) {
  const segments = getWordSegments(word)
  return (
    <div
      css={css`
        font-family: monospace;
        display: flex;
        gap: 0.25rem;
        align-items: baseline;
        margin-bottom: 0.5rem;
      `}
    >
      {segments.map(({ dir, count }, index) => (
        <span
          key={index}
          style={{ color: index === currentIndex ? "white" : getDirColor(dir) }}
          onMouseOver={() => {
            onChangeIndex(index)
          }}
          onFocus={() => {
            onChangeIndex(index)
          }}
          onMouseOut={() => {
            onChangeIndex(-1)
          }}
          onBlur={() => {
            onChangeIndex(-1)
          }}
        >
          {dir}
          {count > 1 && <sup>{count}</sup>}
        </span>
      ))}
    </div>
  )
}

export function ClassRegex({ dirClass }: { dirClass: DirClass }) {
  const regex = dirClass.regex()
  const parts = regex.match(/ru|lu|ld|rd|\(|\)|\||\*/g) ?? []
  return (
    <div
      css={css`
        font-family: monospace;
        font-weight: bold;
        font-size: 1rem;
        margin-bottom: 0.5rem;
      `}
    >
      {parts.map((part, index) => {
        return (
          <span key={index} style={{ color: getDirColor(part) }}>
            {part}
          </span>
        )
      })}
    </div>
  )
}

export function getDirColor(dir: string) {
  return colorMap[dir] ?? colors.fg
}

function getWordSegments(word: string) {
  // reconfigure the word so that it starts with the first "ru" after a "d" (ie, the bottom-left)
  const startIndex = word.indexOf("dru") + 1
  const cycled = word.substring(startIndex) + word.substring(0, startIndex)
  const segments = chunk(cycled, 2).map((segment) => segment.join(""))
  const groupedSegments = []
  let current = { dir: segments[0], count: 0 }
  for (const segment of segments) {
    if (segment !== current.dir) {
      groupedSegments.push(current)
      current = {
        dir: segment,
        count: 1,
      }
    } else {
      current.count++
    }
  }
  groupedSegments.push(current)
  return groupedSegments
}

const colorMap: Record<string, string> = {
  ru: colors.palette[1],
  lu: colors.palette[2],
  ld: colors.palette[3],
  rd: colors.palette[0],
}
