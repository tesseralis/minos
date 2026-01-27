import type Polyomino from "./Polyomino"
import { MONOMINO } from "./internal"

// Generate the genealogy graph of polyominoes
export function generateGraph(
  n: number,
  sort?: (minos: Polyomino[]) => Polyomino[],
) {
  const nodes: Polyomino[][] = []
  const links: [Polyomino, Polyomino][] = []

  // mapping from each mino to its index in the generation
  const indices = new Map<Polyomino, number>()
  const visited = new Set<Polyomino>([MONOMINO])
  let currentGen = [MONOMINO]

  while (nodes.length < n - 1) {
    const nextGen = []
    for (const mino of currentGen) {
      for (const child of mino.freeChildren()) {
        if (!visited.has(child)) {
          nextGen.push(child)
          visited.add(child)
        }
        links.push([mino, child])
      }
    }

    nodes.push(currentGen)
    // currentGen = nextGen
    currentGen = sort?.(nextGen) ?? nextGen
    currentGen.forEach((mino, i) => {
      indices.set(mino, i)
    })
  }
  nodes.push(currentGen)

  return { nodes, links, indices }
}
