// Correspondence between directedness classes and symmetry

import { groupBy, mapValues } from "lodash-es"
import DirClass from "./DirClass"
import type { Symmetry } from "./transform"

const pairs: [string, Symmetry][] = [
  ["rectangle", "all"],
  ["rectangle", "axis2"],
  ["wedge", "diag"],
  ["staircase", "rot"],
  ["staircase", "diag"],
  ["staircase", "diag2"],
  ["stack", "axis"],
  ["fork", "diag"],
  ["bar chart", "axis"],
  ["diamond", "all"],
  ["diamond", "rot2"],
  ["diamond", "axis2"],
  ["diamond", "diag2"],
  ["diamond", "rot"],
  ["diamond", "axis"],
  ["diamond", "diag"],
  ["crescent", "axis"],
  ["antler", "diag"],
  ["range chart", "axis2"],
  ["range chart", "axis"],
  ["range chart", "rot"],
  ["bent tree", "diag"],
  ["tree", "axis"],
]

const symsForClass = mapValues(
  groupBy(pairs, ([cls, sym]) => cls),
  (vals) => vals.map((val) => val[1]),
)

const classesForSym = mapValues(
  groupBy(pairs, ([, sym]) => sym),
  (vals) => vals.map((val) => DirClass.fromName(val[0])),
)

export function possibleSymmetriesForClass(cls: DirClass): Symmetry[] {
  return [...(symsForClass?.[cls.name()] ?? []), "none"]
}

export function possibleClassesForSymmetry(sym: Symmetry): DirClass[] {
  if (sym === "none") {
    return DirClass.all()
  }
  return classesForSym[sym]
}
