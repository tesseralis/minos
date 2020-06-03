import React from "react"
import { css } from "emotion"
import { colors } from "style/theme"

const minoPrefixes = [
  "",
  "mono",
  "do",
  "tro",
  "tetro",
  "pento",
  "hexo",
  "hepto",
  "octo",
]

interface Props {
  gen: number
  children: React.ReactElement
}

/**
 * A wrapper for a generation section that includes a title
 */
export default function GenSection({ gen, children }: Props) {
  return (
    <section
      className={css`
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        :not(:first-child) {
          border-top: 1px ${colors.fg} solid;
        }
      `}
    >
      <h2
        className={css`
          color: ${colors.fg};
          font-size: 1.25rem;
          margin-bottom: 0.75rem;

          span {
            font-size: 0.875rem;
          }
        `}
      >
        {minoPrefixes[gen]}mino <span>(𝑛 = {gen})</span>
      </h2>
      {children}
    </section>
  )
}
