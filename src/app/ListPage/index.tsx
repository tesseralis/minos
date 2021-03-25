import React, { useMemo, useState } from "react"
import { css } from "@emotion/css"
import { nodes } from "app/graph"
import useWindowEventListener from "app/useWindowEventListener"

import { Symmetry } from "mino"
import MinoList from "app/MinoList"
import { useSelected, useSetSelected } from "app/SelectedContext"
import MinoSvg from "app/MinoSvg"
import GenerationRings from "app/FamilyTree/GenerationRings"
import { getTiling } from "mino/tiling"

type YesNo = "yes" | "no"
type Range = [min: number, max: number]

interface MinoFilter {
  symmetries?: Symmetry[]
  // boolean properties
  isConvex?: YesNo
  hasHole?: YesNo
  hasTiling?: YesNo
  /** Minimum and maximum bounding boxes to allow */
  minDimensions?: [number, number]
  maxDimensions?: [number, number]
  /** Range for number of parents to allow */
  numParents?: Range
  /** Range for number of children to allow */
  numChildren?: Range
}

interface Props {
  value: MinoFilter
  onUpdate(value: MinoFilter): void
}

function YesNoOption({ name, value, onUpdate }: any) {
  return (
    <div>
      {name}:
      {[undefined, "yes", "no"].map((val) => {
        return (
          <label key={val}>
            <input
              type="radio"
              name={name}
              value={val}
              checked={value === val}
              onChange={(e) => onUpdate(e.target.value)}
            />
            {val ?? "Show all"}
          </label>
        )
      })}
    </div>
  )
}

function Filter({ value, onUpdate }: Props) {
  return (
    <form>
      <YesNoOption
        name="isConvex"
        onUpdate={(val: any) => onUpdate({ ...value, isConvex: val })}
      />
      <YesNoOption
        name="hasHole"
        onUpdate={(val: any) => onUpdate({ ...value, hasHole: val })}
      />
      <YesNoOption
        name="hasTiling"
        onUpdate={(val: any) => onUpdate({ ...value, hasTiling: val })}
      />
    </form>
  )
}

function applyFilter({ isConvex, hasHole, hasTiling }: MinoFilter) {
  return nodes.map((generation) => {
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
        hasTiling === "yes" ? getTiling(p) : !getTiling(p),
      )
    }
    return filtered
  })
}

/**
 * Displays the list of all minos for each generation
 */
export default function ListPage() {
  const selected = useSelected()
  const setSelected = useSetSelected()
  const [filter, setFilter] = useState<MinoFilter>({})
  useWindowEventListener("click", (e) => {
    // Deselect the current mino if the click target isn't a mino
    // or the compass
    // TODO this is kind of a hack
    if (!(e.target instanceof SVGElement)) {
      setSelected(null)
    }
  })

  const minos = useMemo(() => applyFilter(filter), [filter])

  return (
    <main
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        overflow-y: scroll;
      `}
    >
      <Filter value={filter} onUpdate={setFilter} />
      <MinoList minos={minos} selected={selected} onSelect={setSelected} />
    </main>
  )
}
