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
        width: ${gen <= 4 ? 50 : 100}%;
        :not(:last-child) {
          border-bottom: 1px ${colors.fg} solid;
        }
      `}
    >
      <h2
        className={css`
          font-weight: normal;
          font-size: 1.25rem;
          margin-block-start: 0;
          margin-block-end: 0.75rem;

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
