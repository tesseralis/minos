import React from "react"
import { css } from "@emotion/css"
import { colors } from "style/theme"

interface Props {
  display: string
  onClear(): void
}

/**
 * The display for a group of inputs
 */
export default function InputTitle({ display, onClear }: Props) {
  return (
    <div
      className={css`
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
        className={css`
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
