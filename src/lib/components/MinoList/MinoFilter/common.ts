import { NUM_GENERATIONS } from "$lib/components/graph"
import { DirClass, Polyomino, type Symmetry } from "$lib/mino"
import type { HTMLInputAttributes } from "svelte/elements"

export type YesNoValue = "yes" | "no"
export type YesNoName = "hasHole" | "hasTiling" | "isBalanced"
export type YesNoOptions = { [Name in YesNoName]?: YesNoValue }

export type NumericValue = {
  comp?: Comparator
  value?: number
}
export type NumericOptions = { [key: string]: NumericValue }

/**
 * The currently active mino filters.
 */
export interface FilterOptions {
  symmetries?: Symmetry[]
  classes?: DirClass[]
  // boolean properties
  yesNo?: YesNoOptions
  numeric?: NumericOptions
}

interface YesNoOption {
  name: YesNoName
  predicate(mino: Polyomino): boolean
}

export interface YesNoItem {
  name: YesNoName
  display: string
  optDisplays?: {
    yes: string
    no: string
  }
}

const yesNoOpts: YesNoOption[] = [
  { name: "hasHole", predicate: (p) => p.classes.hasHole() },
  { name: "hasTiling", predicate: (p) => p.tilings.has() },
  { name: "isBalanced", predicate: (p) => p.isBalanced() },
]

export interface NumericOption {
  name: string
  display: string
  key(mino: Polyomino): number
  numberAttrs?: HTMLInputAttributes
}
export const numericOpts: NumericOption[] = [
  {
    name: "size",
    display: "Size",
    key: (p) => p.order,
    numberAttrs: {
      max: NUM_GENERATIONS,
    },
  },
  {
    name: "perimeter",
    display: "Perimeter",
    key: (p) => p.perimeter(),
    numberAttrs: {
      step: 2,
      max: NUM_GENERATIONS * 2 + 2,
    },
  },
  {
    name: "minDim",
    display: "Min dimension",
    key: (p) => Math.min(...p.dims),
    numberAttrs: {
      max: NUM_GENERATIONS,
    },
  },
  {
    name: "maxDim",
    display: "Max dimension",
    key: (p) => Math.max(...p.dims),

    numberAttrs: {
      max: NUM_GENERATIONS,
    },
  },
]

export const defaultValue: FilterOptions = {
  symmetries: [],
  classes: [],
  yesNo: {},
  numeric: Object.fromEntries(numericOpts.map((opt) => [opt.name, {}])),
}

export function upsert<T>(array: T[], value: T) {
  if (array.includes(value)) {
    return array
  }
  return [...array, value]
}

export function remove<T>(array: T[], value: T) {
  const index = array.indexOf(value)
  if (index >= 0) {
    const result = [...array]
    result.splice(index, 1)
    return result
  }
  return array
}

function applyNumericFilter(key: number, { comp, value }: NumericValue) {
  return comp ? compFns[comp]?.(key, value ?? 0) : false
}

export const comparators = ["<", "≤", "=", "≥", ">", "≠"] as const
export type Comparator = (typeof comparators)[number]
const compFns: Record<Comparator, (a: number, b: number) => boolean> = {
  "=": (a, b) => a === b,
  "<": (a, b) => a < b,
  "≤": (a, b) => a <= b,
  ">": (a, b) => a > b,
  "≥": (a, b) => a >= b,
  "≠": (a, b) => a !== b,
}

function applyToMino(
  mino: Polyomino,
  { yesNo = {}, symmetries = [], classes = [], numeric = {} }: FilterOptions,
): boolean {
  for (const { name, predicate } of yesNoOpts) {
    if (yesNo[name] && (yesNo[name] === "yes") !== predicate(mino)) {
      return false
    }
  }
  for (const { name, key } of numericOpts) {
    if (
      numeric[name] &&
      numeric[name].value &&
      numeric[name].comp &&
      !applyNumericFilter(key(mino), numeric[name])
    ) {
      return false
    }
  }
  if (
    symmetries.length > 0 &&
    !symmetries.includes(mino.transform.symmetry())
  ) {
    return false
  }
  if (
    classes.length > 0 &&
    !classes.some((cls) => cls.equals(mino.classes.get()))
  ) {
    return false
  }
  return true
}

/**
 * Apply the provided filter options to the list of minos.
 */
export function applyFilter(minos: Polyomino[][], filterOpts: FilterOptions) {
  return minos.map((generation) => {
    return generation.filter((mino) => applyToMino(mino, filterOpts))
  })
}
