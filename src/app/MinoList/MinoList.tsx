import React, { useState, useMemo } from "react"
import { css } from "@emotion/css"

import { Polyomino } from "mino"
import { nodes } from "app/graph"
import GenerationList from "./GenerationList"
import Filter, { MinoFilter, applyFilter } from "./Filter"

const START_GENS = 6

interface Props {
  narrow?: boolean
  selected?: Polyomino | null
  initFilter?: MinoFilter
  onSelect(mino: Polyomino | null): void
}

const listMinos = nodes.map((gen) => {
  return Polyomino.sort(gen).map((mino) => mino.transform("flipMainDiag"))
})

function NoMatches() {
  return (
    <p
      className={css`
        font-size: 1.25rem;
      `}
    >
      No polyominoes match the given criteria.
    </p>
  )
}

/**
 * Displays the list of all minos for each generation
 */
export default function MinoList({
  selected = null,
  onSelect,
  narrow,
  initFilter = {},
}: Props) {
  const [filter, setFilter] = useState<MinoFilter>(initFilter)

  const minoSets = useMemo(() => applyFilter(listMinos, filter), [filter])

  return (
    <div>
      <Filter value={filter} onUpdate={setFilter} narrow={narrow} />
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        `}
      >
        {minoSets.every((set) => set.length === 0) ? (
          <NoMatches />
        ) : (
          minoSets.map((minos, i) => {
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
          })
        )}
      </div>
    </div>
  )
}
