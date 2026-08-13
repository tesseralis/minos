// Correspondence between directedness classes and symmetry

import { groupBy, mapValues } from "lodash-es"
import DirClass from "./DirClass"
import { symmetries, type Symmetry } from "./transform"

const pairs: [string, Symmetry][] = [
  ["rectangle", "all"],
  ["rectangle", "axis2"],
  ["rectangle", "rot2"],
  ["rectangle", "diag2"],
  ["rectangle", "axis"],
  ["rectangle", "rot"],
  ["rectangle", "diag"],
  ["wedge", "diag"],
  ["staircase", "rot"],
  ["staircase", "diag"],
  ["staircase", "diag2"],
  ["stack", "axis"],
  ["fork", "diag"],
  ["bar chart", "axis"],
  ["diamond", "all"],
  ["diamond", "axis2"],
  ["diamond", "rot2"],
  ["diamond", "diag2"],
  ["diamond", "axis"],
  ["diamond", "rot"],
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
  if (cls.name() === "other") {
    return [...symmetries]
  }
  return [...(symsForClass?.[cls.name()] ?? []), "none"]
}

export function possibleClassesForSymmetry(sym: Symmetry): DirClass[] {
  if (sym === "none") {
    return DirClass.all()
  }
  return [...classesForSym[sym], DirClass.fromName("other")]
}

export function possibleOnlyIfPunctured(cls: DirClass, sym: Symmetry) {
  return cls.name() === "rectangle" && !["all", "axis2"].includes(sym)
}
