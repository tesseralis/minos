import { groupBy } from "lodash"
import { nodes } from "components/graph"
import { Symmetry } from "mino"

const minos = nodes.flat()
const symClasses = groupBy(minos, (m) => m.transform.symmetry())

export function getMinosForSymmetry(symmetry: Symmetry) {
  return symClasses[symmetry]
}
