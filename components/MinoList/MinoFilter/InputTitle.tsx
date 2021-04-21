import React from "react"
import { css } from "@emotion/react"
import { colors } from "style/theme"

interface Props {
  display: string
  onClear(): void
}

/**
 * The title display for a group of inputs, with a clear button.
 */
export default function InputTitle({ display, onClear }: Props) {
  return (
    <div
      css={css`
        font-size: 1.125rem;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 4rem;
      `}
    >
      {display}
      <button
        type="button"
        onClick={onClear}
        css={css`
          /* TODO (refactor) factor out this button style */
          font-size: 1rem;
          font-family: serif;
          margin-left: 1rem;
          color: ${colors.fg};
          background: none;
          border: none;
          cursor: pointer;
          :hover {
            color: ${colors.highlight};
          }
        `}
      >
        clear
      </button>
    </div>
  )
}
