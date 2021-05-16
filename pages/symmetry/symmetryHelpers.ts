import { groupBy } from "lodash"
import { nodes } from "components/graph"
import { symmetries, Symmetry } from "mino"

const minos = nodes.flat()
const symClasses = groupBy(minos, (m) => m.transform.symmetry())

export function getMinosForSymmetry(symmetry: Symmetry) {
  return symClasses[symmetry]
}

export function getMinosBySymmetry() {
  const minos = nodes.flat()
  const symClasses = groupBy(minos, (m) => m.transform.symmetry())
  return symmetries.map((sym) => ({ name: sym, minos: symClasses[sym] }))
}
