/**
 * Functions dealing with generation of polyominoes.
 */

import { MONOMINO, contains, getPoints } from "./mino"

import { addSquare } from "./modify"

import type { Point } from "math"
import type { Mino } from "./mino"

/**
 * Return the neighbors of the point [i,j]
 */
function* nbrs([i, j]: Point): Generator<Point> {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield [i + 1, j]
  yield [i - 1, j]
  yield [i, j + 1]
  yield [i, j - 1]
}

/**
 * Get all neighboring points of the given mino
 */
export function* getNeighbors(mino: Mino): Generator<Point> {
  for (const point of getPoints(mino)) {
    for (const nbr of nbrs(point)) {
      if (!contains(mino, nbr)) {
        yield nbr
      }
    }
  }
}

// Get the children of the given mino
export function* getChildren(mino: Mino) {
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
