import {
  WIDTH_BITS,
  MAX_WIDTH,
  MONOMINO,
  getMino,
  getData,
  getWidth,
  getPoints,
} from "./mino"

import type { Point } from "math"
import type { Mino } from "./mino"

/**
 * Functions dealing with generation of polyominoes.
 */

/**
 * Get the point `[i, j]` in the mino with width `w`.
 */
function getPointMask(i: number, j: number, w: number) {
  return 1 << (i * w + j + WIDTH_BITS)
}

/**
 * Returns true if the mino contains the given point
 */
function contains(mino: Mino, [i, j]: Point) {
  const w = getWidth(mino)
  if (i < 0 || j < 0 || j >= w) {
    return false
  }
  return !!(mino & getPointMask(i, j, w))
}

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

function shiftUp(mino: Mino): Mino {
  const w = getWidth(mino)
  const data = mino >> WIDTH_BITS
  return getMino(data << w, w)
}

function incWidth(mino: Mino): Mino {
  const w = getWidth(mino)
  if (w === MAX_WIDTH) throw new Error("Already at maximum width")
  let result = 0
  let i = 0
  let data = getData(mino)
  while (data) {
    const row = data % (1 << w)
    result = result | (row << (i * (w + 1)))
    i++
    data = data >> w
  }
  return getMino(result, w + 1)
}

function shiftLeft(mino: Mino): Mino {
  const expanded = incWidth(mino)
  const data = getData(expanded)

  return getMino(data << 1, getWidth(expanded))
}

function doAppend(mino: Mino, i: number, j: number): Mino {
  return mino | getPointMask(i, j, getWidth(mino))
}

// Append the point [i,j] to the mino
export function append(mino: Mino, [i, j]: Point): Mino {
  const w = getWidth(mino)
  if (i < 0) {
    return doAppend(shiftUp(mino), 0, j)
  }
  if (j < 0) {
    return doAppend(shiftLeft(mino), i, 0)
  }
  if (j === w) {
    return doAppend(incWidth(mino), i, j)
  }
  // otherwise add the point value to the mino
  return doAppend(mino, i, j)
}

// Get the children of the given mino
export function* getChildren(mino: Mino) {
  // get all neighbors
  const nbrs = getNeighbors(mino)
  for (const nbr of nbrs) {
    yield append(mino, nbr)
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
  // do something here
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
