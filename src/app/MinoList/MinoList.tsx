import React, { useState, useMemo } from "react"
import { css } from "@emotion/css"
import { colors } from "style/theme"

import type { Polyomino } from "mino"
import GenerationList from "./GenerationList"
import Filter, { MinoFilter, applyFilter } from "./Filter"

const START_GENS = 6

interface Props {
  narrow?: boolean
  selected?: Polyomino | null
  onSelect(mino: Polyomino | null): void
}

/**
 * Displays the list of all minos for each generation
 */
export default function MinoList({ selected = null, onSelect, narrow }: Props) {
  const [filter, setFilter] = useState<MinoFilter>({})
  const [showFilter, setShowFilter] = useState(false)

  const minos = useMemo(() => applyFilter(filter), [filter])

  return (
    <div>
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
      {showFilter && <Filter value={filter} onUpdate={setFilter} />}
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        `}
      >
        {minos.map((minos, i) => {
          const gen = i + 1
          const hasSelected = !!selected && selected.order === gen
          return (
            <GenerationList
              narrow={narrow}
              minos={minos}
              gen={gen}
              key={gen}
              skipAnimation={gen <= START_GENS}
              selected={hasSelected ? selected : null}
              onSelect={onSelect}
            />
          )
        })}
      </div>
    </div>
  )
}
