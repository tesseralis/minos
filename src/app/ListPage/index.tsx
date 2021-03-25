import React, { useMemo, useState } from "react"
import { css } from "@emotion/css"
import { nodes } from "app/graph"
import useWindowEventListener from "app/useWindowEventListener"

import { symmetries, Symmetry } from "mino"
import MinoList from "app/MinoList"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { getTiling } from "mino/tiling"

type YesNo = "yes" | "no" | ""
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

function upsert<T>(array: T[], value: T) {
  if (array.includes(value)) {
    return array
  }
  return [...array, value]
}

function remove<T>(array: T[], value: T) {
  const index = array.indexOf(value)
  if (index >= 0) {
    const result = [...array]
    result.splice(index, 1)
    return result
  }
  return array
}

function SymmetryOptions({ value = [], onUpdate }: any) {
  return (
    <div>
      Symmetries:
      {symmetries.map((sym) => {
        return (
          <label key={sym}>
            <input
              type="checkbox"
              checked={value.includes(sym)}
              onChange={(e) =>
                onUpdate(
                  e.target.checked ? upsert(value, sym) : remove(value, sym),
                )
              }
            />
            {sym}
          </label>
        )
      })}
    </div>
  )
}

function YesNoOption({ name, value, onUpdate }: any) {
  return (
    <div>
      {name}:
      {["", "yes", "no"].map((val) => {
        return (
          <label key={val}>
            <input
              type="radio"
              name={name}
              value={val}
              checked={value === val}
              onChange={(e) => onUpdate(e.target.value)}
            />
            {val || "Show all"}
          </label>
        )
      })}
    </div>
  )
}

function Filter({ value, onUpdate }: Props) {
  return (
    <form>
      <SymmetryOptions
        value={value.symmetries}
        onUpdate={(val: any) => onUpdate({ ...value, symmetries: val })}
      />
      <YesNoOption
        name="isConvex"
        value={value.isConvex}
        onUpdate={(val: any) => onUpdate({ ...value, isConvex: val })}
      />
      <YesNoOption
        name="hasHole"
        value={value.hasHole}
        onUpdate={(val: any) => onUpdate({ ...value, hasHole: val })}
      />
      <YesNoOption
        name="hasTiling"
        value={value.hasTiling}
        onUpdate={(val: any) => onUpdate({ ...value, hasTiling: val })}
      />
    </form>
  )
}

function applyFilter({
  isConvex,
  hasHole,
  hasTiling,
  symmetries = [],
}: MinoFilter) {
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
    if (symmetries.length > 0) {
      filtered = filtered.filter((p) => symmetries.includes(p.symmetry()))
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
