import React, { useState } from "react"
import { css } from "@emotion/css"
import { nodes, baseColorMap } from "app/graph"

import { Polyomino, Symmetry } from "mino"
import MinoDiv from "app/MinoList/MinoDiv"
import { colors } from "style/theme"

type YesNo = "yes" | "no" | ""
type Range = [min: number, max: number]

export interface MinoFilter {
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

interface InputTitleProps {
  display: string
  onClear(): void
}

function InputTitle({ display, onClear }: InputTitleProps) {
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
      <InputTitle display="Symmetries" onClear={() => onUpdate([])} />
      <div
        className={css`
          margin-top: 1rem;
          display: grid;
          grid-gap: 0.5rem 1rem;
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

interface YesNoItem {
  name: string
  display: string
  yes: string
  no: string
}

const yesNoItems: YesNoItem[] = [
  {
    name: "isConvex",
    display: "Convexity",
    yes: "convex",
    no: "concave",
  },
  {
    name: "hasHole",
    display: "Holes",
    yes: "has hole",
    no: "no holes",
  },
  {
    name: "hasTiling",
    display: "Tiling",
    yes: "has tiling",
    no: "no tiling",
  },
]

interface YesNoProps {
  name: string
  item: YesNoItem
  display: string
  value?: string
  onUpdate(val?: string): void
}

function YesNoOption({ display, name, value, onUpdate, item }: YesNoProps) {
  return (
    <div
      className={css`
        margin-bottom: 1rem;
      `}
    >
      <div>
        <InputTitle display={display} onClear={() => onUpdate()} />
      </div>
      {["yes", "no"].map((val) => {
        const checked = value === val
        return (
          <label key={val}>
            <input
              type="radio"
              className="visually-hidden"
              name={name}
              value={val}
              checked={checked}
              onChange={(e) => onUpdate(e.target.value)}
            />
            <span
              className={css`
                margin-right: 1rem;
                color: ${checked ? colors.highlight : colors.fg};
                text-decoration: ${checked ? "underline" : "none"};
                cursor: pointer;
              `}
            >
              {(item as any)[val]}
            </span>
          </label>
        )
      })}
    </div>
  )
}

function FilterForm({ value, onUpdate }: Props) {
  return (
    <form
      className={css`
        margin: 0 4rem;
        display: flex;
      `}
    >
      <SymmetryOptions
        value={value.symmetries}
        onUpdate={(val: any) => onUpdate({ ...value, symmetries: val })}
      />
      <div
        className={css`
          margin-left: 2rem;
        `}
      >
        {yesNoItems.map((item) => (
          <YesNoOption
            key={item.name}
            name={item.name}
            display={item.display}
            item={item}
            value={(value as any)[item.name]}
            onUpdate={(val: any) => onUpdate({ ...value, [item.name]: val })}
          />
        ))}
      </div>
    </form>
  )
}

export default function Filter({ value, onUpdate }: Props) {
  const [showFilter, setShowFilter] = useState(false)

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
      {showFilter && <FilterForm value={value} onUpdate={onUpdate} />}
    </div>
  )
}

export function applyFilter({
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
