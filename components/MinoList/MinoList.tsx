import { useState, useMemo } from "react"
import { css } from "@emotion/react"

import { Polyomino } from "mino"
import { nodes } from "components/graph"
import GenerationList from "./GenerationList"
import Filter, { FilterOptions, applyFilter } from "./MinoFilter"

const START_GENS = 6

interface Props {
  selected?: Polyomino | null
  initFilter?: FilterOptions
  to(mino: Polyomino): string
}

const listMinos = nodes.map(Polyomino.sort)

function NoMatches() {
  return (
    <p
      css={css`
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
  to,
  initFilter = {},
}: Props) {
  const [filter, setFilter] = useState<FilterOptions>(initFilter)

  const minoSets = useMemo(() => applyFilter(listMinos, filter), [filter])

  return (
    <div>
      <Filter value={filter} onUpdate={setFilter} />
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          gap: 2rem;
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
                minos={minos}
                gen={gen}
                key={gen}
                selected={hasSelected ? selected : null}
                to={to}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
