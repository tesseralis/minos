import { nodes } from "$lib/components/graph"
import { Polyomino, symmetries, type Symmetry } from "$lib/mino"

const symClasses = Object.fromEntries(
  symmetries.map((sym) => [sym, []] as [Symmetry, Polyomino[][]]),
)

for (const [gen, minos] of nodes.entries()) {
  for (const mino of minos) {
    const sym = mino.transform.symmetry()
    if (!symClasses[sym][gen + 1]) {
      symClasses[sym][gen + 1] = []
    }
    symClasses[sym][gen + 1].push(mino)
  }
}

export function getMinosForSymmetry(symmetry: Symmetry) {
  return symClasses[symmetry]
}
