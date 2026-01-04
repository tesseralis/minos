import { nodes } from "$lib/components/graph"
import { Polyomino, type Symmetry } from "$lib/mino"

const symClasses: Record<Symmetry, Polyomino[][]> = {} as any

for (const [gen, minos] of nodes.entries()) {
  for (const mino of minos) {
    const sym = mino.transform.symmetry()
    if (!symClasses[sym]) {
      symClasses[sym] = []
    }
    if (!symClasses[sym][gen + 1]) {
      symClasses[sym][gen + 1] = []
    }
    symClasses[sym][gen + 1].push(mino)
  }
}

export function getMinosForSymmetry(symmetry: Symmetry) {
  return symClasses[symmetry]
}
