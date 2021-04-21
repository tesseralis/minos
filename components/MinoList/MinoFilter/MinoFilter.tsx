import { useState } from "react"
import { css } from "@emotion/react"

import { colors } from "style/theme"
import SymmetryInput from "./SymmetryInput"
import YesNoInputs from "./YesNoInputs"
import { FilterOptions } from "./common"

interface Props {
  value: FilterOptions
  onUpdate(value: FilterOptions): void
  narrow?: boolean
}

function FilterForm({ narrow, value, onUpdate }: Props) {
  return (
    <form
      css={css`
        margin: 0 4rem;
        display: flex;
        flex-wrap: wrap;
      `}
    >
      <SymmetryInput
        value={value.symmetries}
        onUpdate={(val) => onUpdate({ ...value, symmetries: val })}
      />
      <div
        css={css`
          margin-left: ${narrow ? 0 : "2rem"};
          margin-top: ${narrow ? "2rem" : 0};
        `}
      >
        <YesNoInputs
          onUpdate={(val) => onUpdate({ ...value, yesNo: val })}
          value={value.yesNo}
        />
      </div>
    </form>
  )
}

/**
 * Collapsible filter for various properties of polyominoes.
 */
export default function MinoFilter(props: Props) {
  const [showFilter, setShowFilter] = useState(false)

  return (
    <div>
      {/* TODO (a11y) probably aria-expanded? */}
      <button
        css={css`
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
