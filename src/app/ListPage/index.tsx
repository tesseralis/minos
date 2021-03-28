import React, { useMemo, useState } from "react"
import { css } from "@emotion/css"
import { nodes, baseColorMap } from "app/graph"
import useWindowEventListener from "app/useWindowEventListener"

import { Polyomino, Symmetry } from "mino"
import MinoList from "app/MinoList"
import { useSelected, useSetSelected } from "app/SelectedContext"
import MinoDiv from "app/MinoList/MinoDiv"

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

interface SymmetryType {
  type: Symmetry
  mino: Polyomino
}

const symSections: SymmetryType[] = [
  { type: "none", mino: Polyomino.of("010_110_011") },
  { type: "reflectOrtho", mino: Polyomino.of("100_111_100") },
  { type: "reflectDiag", mino: Polyomino.of("100_100_111") },
  { type: "rotate2", mino: Polyomino.of("001_111_100") },
  { type: "dihedralOrtho", mino: Polyomino.of("101_111_101") },
  { type: "dihedralDiag", mino: Polyomino.of("110_111_011") },
  { type: "rotate4", mino: Polyomino.of("0010_1110_0111_0100") },
  { type: "all", mino: Polyomino.of("010_111_010") },
]

interface SymOptProps {
  value?: Symmetry[]
  onUpdate(value: Symmetry[]): void
}

function SymmetryOptions({ value = [], onUpdate }: SymOptProps) {
  return (
    <div>
      Symmetries:
      <div
        className={css`
          display: grid;
          width: 15rem;
          grid-template-areas:
            ".    reflectOrtho dihedralOrtho ."
            "none reflectDiag  dihedralDiag  all"
            ".    rotate2      rotate4       .";
        `}
      >
        {symSections.map(({ type: sym, mino }) => {
          const checked = value.includes(sym)
          return (
            <label
              key={sym}
              className={css`
                grid-area: ${sym};
              `}
            >
              <input
                type="checkbox"
                className="visually-hidden"
                checked={checked}
                onChange={(e) =>
                  onUpdate(
                    e.target.checked ? upsert(value, sym) : remove(value, sym),
                  )
                }
              />
              <MinoDiv
                mino={mino}
                fill="none"
                stroke={checked ? baseColorMap[sym] : "grey"}
                size={30 / mino.width}
              />
            </label>
          )
        })}
      </div>
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
    <form
      className={css`
        margin: 2rem;
        display: flex;
      `}
    >
      <SymmetryOptions
        value={value.symmetries}
        onUpdate={(val: any) => onUpdate({ ...value, symmetries: val })}
      />
      <div>
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
      </div>
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
        hasTiling === "yes" ? p.tiling() : !p.tiling(),
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
