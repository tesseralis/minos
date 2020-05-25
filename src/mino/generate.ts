/**
 * Functions dealing with generation of polyominoes.
 */

import { Mino, MONOMINO, getNeighbors, getPoints, isValid } from "./mino"

import { addSquare, removeSquare } from "./modify"

/**
 * Iterate over all the parents of the mino
 */
export function* getParents(mino: Mino): Generator<Mino> {
  for (const square of getPoints(mino)) {
    const parent = removeSquare(mino, square)
    if (isValid(parent)) {
      yield parent
    }
  }
}

/**
 * Iterate over all the children of the mino
 */
export function* getChildren(mino: Mino): Generator<Mino> {
  // get all neighbors
  const nbrs = getNeighbors(mino)
  for (const nbr of nbrs) {
    yield addSquare(mino, nbr)
  }
}

// Get the children of the given collection of minos
function getAllChildren(minos: Iterable<Mino>): Set<Mino> {
  const result = new Set<Mino>()
  for (const parent of minos) {
    for (const child of getChildren(parent)) {
      result.add(child)
    }
  }
  return result
}

/**
 * Generates all the n-ominoes, that is, the polyoinoes with n squares.
 */
export function generate(n: number): Set<Mino> {
  if (n === 0) {
    return new Set()
  }
  if (n === 1) {
    return new Set([MONOMINO])
  } else {
    const parentGen = generate(n - 1)
    return getAllChildren(parentGen)
  }
}
