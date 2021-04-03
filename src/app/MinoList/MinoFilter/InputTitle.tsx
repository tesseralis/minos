import React from "react"
import { css } from "@emotion/css"
import { colors } from "style/theme"

interface InputTitleProps {
  display: string
  onClear(): void
}

export default function InputTitle({ display, onClear }: InputTitleProps) {
  return (
    <div
      className={css`
        font-size: 1.125rem;
      `}
    >
      {display}
      <button
        type="button"
        onClick={onClear}
        className={css`
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
