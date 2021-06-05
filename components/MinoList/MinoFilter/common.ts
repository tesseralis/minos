import { Polyomino, Symmetry } from "mino"

export type YesNo = "yes" | "no"

export type YesNoName =
  | "isDirected"
  | "isBarChart"
  | "isConvex"
  | "hasHole"
  | "hasTiling"
export type YesNoOptions = { [Name in YesNoName]?: YesNo }

/**
 * The currently active mino filters.
 */
export interface FilterOptions {
  symmetries?: Symmetry[]
  // boolean properties
  yesNo?: YesNoOptions
}

interface YesNoOption {
  name: YesNoName
  predicate(mino: Polyomino): boolean
}

const yesNoOpts: YesNoOption[] = [
  { name: "isDirected", predicate: (p) => p.classes.isDirected() },
  { name: "isConvex", predicate: (p) => p.classes.isConvex() },
  { name: "hasHole", predicate: (p) => p.classes.hasHole() },
  { name: "hasTiling", predicate: (p) => p.tilings.has() },
]

function applyToMino(
  mino: Polyomino,
  { yesNo = {}, symmetries = [] }: FilterOptions,
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
