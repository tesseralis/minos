import React, { useState } from "react"
import { css } from "@emotion/css"

import { Polyomino, Symmetry } from "mino"
import { colors } from "style/theme"
import SymmetryOptions from "./SymmetryOptions"
import YesNoOptions from "./YesNoOptions"

type YesNo = "yes" | "no" | ""

export interface MinoFilter {
  symmetries?: Symmetry[]
  // boolean properties
  isConvex?: YesNo
  hasHole?: YesNo
  hasTiling?: YesNo
}

interface Props {
  value: MinoFilter
  onUpdate(value: MinoFilter): void
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

export default function Filter(props: Props) {
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

export function applyFilter(
  minos: Polyomino[][],
  { isConvex, hasHole, hasTiling, symmetries = [] }: MinoFilter,
) {
  return minos.map((generation) => {
    let filtered = generation
    if (isConvex) {
      filtered = filtered.filter((p) =>
        isConvex === "yes" ? p.isConvex() : !p.isConvex(),
      )
    }
    if (hasHole) {
      filtered = filtered.filter((p) =>
        hasHole === "yes" ? p.hasHole() : !p.hasHole(),
      )
    }
    if (hasTiling) {
      filtered = filtered.filter((p) =>
        hasTiling === "yes" ? p.tiling() : !p.tiling(),
      )
    }
    if (symmetries.length > 0) {
      filtered = filtered.filter((p) => symmetries.includes(p.symmetry()))
    }
    return filtered
  })
}
