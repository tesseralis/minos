import { ReactNode } from "react"
import { css } from "@emotion/react"
import { colors } from "style/theme"
import { orderName } from "mino"

interface HeaderProps {
  gen: number
  count: number
}

function Header({ gen, count }: HeaderProps) {
  return (
    <div
      css={css`
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2rem;
        justify-content: space-around;
        padding: 0 1rem;
        margin-bottom: 0.75rem;
      `}
    >
      <h2
        css={css`
          font-size: 1.25rem;
          margin: 0;

          span {
            font-size: 0.875rem;
          }
        `}
      >
        {orderName(gen, gen > 2)} <span>(𝑛 = {gen})</span>
      </h2>
      <span
        css={css`
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
  children: ReactNode
}

/**
 * A wrapper for a generation section that includes a title
 */
export default function GenSection({ gen, count, children }: Props) {
  return (
    <section
      css={css`
        padding: 2rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: max-content;
        flex-grow: 1;
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
