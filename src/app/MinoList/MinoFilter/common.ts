import { Polyomino, Symmetry } from "mino"

type YesNo = "yes" | "no" | ""

export interface FilterOptions {
  symmetries?: Symmetry[]
  // boolean properties
  isConvex?: YesNo
  hasHole?: YesNo
  hasTiling?: YesNo
}

function applyToMino(
  mino: Polyomino,
  { isConvex, hasHole, hasTiling, symmetries = [] }: FilterOptions,
): boolean {
  if (isConvex && (isConvex === "yes") !== mino.isConvex()) {
    return false
  }
  if (hasHole && (hasHole === "yes") !== mino.hasHole()) {
    return false
  }
  if (hasTiling && (hasTiling === "yes") !== !!mino.tiling()) {
    return false
  }
  if (symmetries.length > 0 && !symmetries.includes(mino.symmetry())) {
    return false
  }
  return true
}

export function applyFilter(minos: Polyomino[][], filterOpts: FilterOptions) {
  return minos.map((generation) => {
    return generation.filter((mino) => applyToMino(mino, filterOpts))
  })
}
