import { DirClass, Polyomino, Symmetry } from "mino"

export type YesNo = "yes" | "no"

export type YesNoName = "hasHole" | "hasTiling" | "isBalanced"
export type YesNoOptions = { [Name in YesNoName]?: YesNo }

/**
 * The currently active mino filters.
 */
export interface FilterOptions {
  symmetries?: Symmetry[]
  classes?: DirClass[]
  // boolean properties
  yesNo?: YesNoOptions
}

interface YesNoOption {
  name: YesNoName
  predicate(mino: Polyomino): boolean
}

const yesNoOpts: YesNoOption[] = [
  { name: "hasHole", predicate: (p) => p.classes.hasHole() },
  { name: "hasTiling", predicate: (p) => p.tilings.has() },
  { name: "isBalanced", predicate: (p) => p.isBalanced() },
]

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

function applyToMino(
  mino: Polyomino,
  { yesNo = {}, symmetries = [], classes = [] }: FilterOptions,
): boolean {
  for (const { name, predicate } of yesNoOpts) {
    if (yesNo[name] && (yesNo[name] === "yes") !== predicate(mino)) {
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
