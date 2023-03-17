import { css } from "@emotion/react"
import { Line, Rect } from "./svg"

export default function Logo() {
  const size = 10
  const margin = 1
  return (
    <svg
      viewBox={`${-margin} ${-margin} ${size * 3 + 2 * margin} ${
        size * 3 + 2 * margin
      }`}
      css={css`
        width: 100%;
        aspect-ratio: 1 / 1;
        overflow: visible;

        rect,
        line {
          fill: none;
          stroke: grey;
        }
      `}
    >
      <Rect width={size * 3} height={size * 3} />
      <Rect coord={[size, size]} width={size} height={size} />
      <Line p1={[size, 0]} p2={[size, size]} />
      <Line p1={[0, 2 * size]} p2={[3 * size, 2 * size]} />
    </svg>
  )
}
