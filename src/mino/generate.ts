/**
 * Functions dealing with generation of polyominoes.
 */

import { Mino, Coord, MONOMINO, getNeighbors, getCoords, isValid } from "./mino"

import { addSquare, removeSquare } from "./modify"

export interface PossibleRelativeLink {
  mino?: Mino
  coord: Coord
}

export function* getPossibleParents(
  mino: Mino,
): Generator<PossibleRelativeLink> {
  for (const coord of getCoords(mino)) {
    const parent = removeSquare(mino, coord)
    yield { mino: isValid(parent) ? parent : undefined, coord }
  }
}

/**
 * A parent/child mino and the point that is added/removed to create it
 */
export type RelativeLink = Required<PossibleRelativeLink>

/**
 * Iterate over all the parents of the mino
 */
export function* getParents(mino: Mino): Generator<RelativeLink> {
  for (const link of getPossibleParents(mino)) {
    if (link.mino) {
      yield link as RelativeLink
    }
  }
}

/**
 * Iterate over all the children of the mino
 */
export function* getChildren(mino: Mino): Generator<RelativeLink> {
  // get all neighbors
  for (const coord of getNeighbors(mino)) {
    yield { mino: addSquare(mino, coord), coord }
  }
}

// Get the children of the given collection of minos
function getAllChildren(minos: Iterable<Mino>): Set<Mino> {
  const result = new Set<Mino>()
  for (const parent of minos) {
    for (const { mino: child } of getChildren(parent)) {
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
