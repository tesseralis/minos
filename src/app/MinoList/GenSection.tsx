import React from "react"
import { css } from "@emotion/css"
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

interface HeaderProps {
  gen: number
  count: number
}

function Header({ gen, count }: HeaderProps) {
  return (
    <div
      className={css`
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2rem;
        justify-content: space-around;
        padding: 0 2rem;
        margin-bottom: 0.75rem;
      `}
    >
      <h2
        className={css`
          font-weight: normal;
          font-size: 1.25rem;
          margin: 0;

          span {
            font-size: 0.875rem;
          }
        `}
      >
        {minoPrefixes[gen]}mino{gen > 2 ? "es" : ""} <span>(𝑛 = {gen})</span>
      </h2>
      <span
        className={css`
          font-size: 1rem;
          justify-self: end;
        `}
      >
        {count}
      </span>
    </div>
  )
}

interface Props {
  gen: number
  count: number
  children: React.ReactElement
  narrow?: boolean
}

/**
 * A wrapper for a generation section that includes a title
 */
export default function GenSection({ gen, count, children, narrow }: Props) {
  return (
    <section
      className={css`
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: ${!narrow && gen <= 4 ? 50 : 100}%;
        :not(:last-child) {
          border-bottom: 1px ${colors.fg} solid;
        }
      `}
    >
      <Header gen={gen} count={count} />
      {children}
    </section>
  )
}
