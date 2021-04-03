import React, { useState } from "react"
import { css } from "@emotion/css"

import { colors } from "style/theme"
import SymmetryOptions from "./SymmetryInput"
import YesNoOptions from "./YesNoInputs"
import { FilterOptions } from "./common"

interface Props {
  value: FilterOptions
  onUpdate(value: FilterOptions): void
  narrow?: boolean
}

function FilterForm({ narrow, value, onUpdate }: Props) {
  return (
    <form
      className={css`
        margin: 0 4rem;
        display: flex;
        flex-wrap: wrap;
      `}
    >
      <SymmetryOptions
        value={value.symmetries}
        onUpdate={(val: any) => onUpdate({ ...value, symmetries: val })}
      />
      <div
        className={css`
          margin-left: ${narrow ? 0 : "2rem"};
          margin-top: ${narrow ? "2rem" : 0};
        `}
      >
        <YesNoOptions onUpdate={onUpdate} value={value} />
      </div>
    </form>
  )
}

export default function MinoFilter(props: Props) {
  const [showFilter, setShowFilter] = useState(false)

  return (
    <div>
      {/* TODO (a11y) probably aria-expanded? */}
      <button
        className={css`
          color: ${colors.fg};
          text-align: right;
          background: none;
          border: none;
          font-family: serif;
          font-size: 1.125rem;
          margin-top: 2rem;
          margin-left: 2rem;
          cursor: pointer;
          :hover {
            color: ${colors.highlight};
          }
        `}
        onClick={() => setShowFilter((filter) => !filter)}
      >
        {showFilter ? "Hide" : "Show"} filters
      </button>
      {showFilter && <FilterForm {...props} />}
    </div>
  )
}
