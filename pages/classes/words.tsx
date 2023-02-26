import { css } from "@emotion/react"
import { chunk } from "lodash"
import { DirClass } from "mino"
import { colors } from "style/theme"

export function BoundaryWord({ word }: { word: string }) {
  // reconfigure the word so that it starts with "ru"
  const startIndex = word.indexOf("ru")
  const cycled = word.substring(startIndex) + word.substring(0, startIndex)
  const segments = chunk(cycled, 2).map((segment) => segment.join(""))
  return (
    <div
      css={css`
        font-family: monospace;
        display: flex;
        gap: 0.25rem;
      `}
    >
      {segments.map((segment, index) => (
        <span
          key={index}
          css={css`
            color: ${colorMap[segment] ?? colors.fg};
          `}
        >
          {segment}
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
      `}
    >
      {parts.map((part, index) => {
        return (
          <span
            key={index}
            css={css`
              color: ${colorMap[part] ?? colors.fg};
            `}
          >
            {part}
          </span>
        )
      })}
    </div>
  )
}

const colorMap: Record<string, string> = {
  ru: colors.palette[1],
  lu: colors.palette[2],
  ld: colors.palette[3],
  rd: colors.palette[0],
}
