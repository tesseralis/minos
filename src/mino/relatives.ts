/**
 * Utilities for calculating relatives of polyominoes
 */

import Vector from "vector"
import {
  MinoData,
  Coord,
  MAX_WIDTH,
  fromBits,
  contains,
  getCoords,
  getData,
  getWidth,
  rowBits,
  getCoordMask,
  getColumnMask,
} from "./data"

/**
 * Return the mino with the width adjusted by delta (e.g. +1 or -1)
 */
function adjustWidth(mino: MinoData, delta: number): MinoData {
  const w = getWidth(mino) + delta
  if (w >= MAX_WIDTH) throw new Error("Already at maximum width")
  if (w < 1) throw new Error("Already at minimum width")
  let result = 0
  let i = 0

  for (const row of rowBits(mino)) {
    result |= row << (i * w)
    i++
  }
  return fromBits(result, w)
}

function incWidth(mino: MinoData): MinoData {
  return adjustWidth(mino, +1)
}

function decWidth(mino: MinoData): MinoData {
  return adjustWidth(mino, -1)
}

function shiftLeft(mino: MinoData): MinoData {
  const expanded = incWidth(mino)
  const data = getData(expanded)

  return fromBits(data << 1, getWidth(expanded))
}

function shiftRight(mino: MinoData): MinoData {
  const decremented = decWidth(mino)
  const data = getData(decremented)

  return fromBits(data >> 1, getWidth(decremented))
}

function shiftDown(mino: MinoData): MinoData {
  const w = getWidth(mino)
  return fromBits(getData(mino) >> w, w)
}

function shiftUp(mino: MinoData): MinoData {
  const w = getWidth(mino)
  return fromBits(getData(mino) << w, w)
}

function doAdd(mino: MinoData, i: number, j: number): MinoData {
  return mino | getCoordMask(i, j, getWidth(mino))
}

/**
 * Append the square at [i,j] to the mino
 */
export function addSquare(mino: MinoData, p: Coord): MinoData {
  if (p.x < 0) {
    return doAdd(shiftUp(mino), 0, p.y)
  }
  if (p.y < 0) {
    return doAdd(shiftLeft(mino), p.x, 0)
  }
  if (p.y === getWidth(mino)) {
    return doAdd(incWidth(mino), p.x, p.y)
  }
  return doAdd(mino, p.x, p.y)
}

function bottomRowEmpty(mino: MinoData): boolean {
  const row = [...rowBits(mino)][0]
  return !row
}

function rightColumnEmpty(mino: MinoData): boolean {
  return !getColumnMask(mino, 0)
}

function leftColumnEmpty(mino: MinoData): boolean {
  return !getColumnMask(mino, getWidth(mino) - 1)
}

function doRemove(mino: MinoData, i: number, j: number): MinoData {
  return mino & ~getCoordMask(i, j, getWidth(mino))
}

/**
 * Remove the square at coordinate [i, j] from the Mino
 */
export function removeSquare(mino: MinoData, p: Coord): MinoData {
  const removed = doRemove(mino, p.x, p.y)
  if (bottomRowEmpty(removed)) {
    return shiftDown(removed)
  } else if (rightColumnEmpty(removed)) {
    return shiftRight(removed)
  } else if (leftColumnEmpty(removed)) {
    return decWidth(removed)
  }
  return removed
}

/**
 * Return the neighbors of the coord [i,j]
 */
export function* getNeighbors(p: Coord): Generator<Coord> {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield p.add(Vector.RIGHT)
  yield p.add(Vector.LEFT)
  yield p.add(Vector.DOWN)
  yield p.add(Vector.UP)
}

export function isValid(mino: MinoData): boolean {
  const p0 = [...getCoords(mino)][0]
  // the null-omino is not a valid polyomino
  if (!p0) return false
  const queue = [p0]
  const width = getWidth(mino)

  // Initialize the visited bitmask
  // Include the mino's width so that we can easily compare later
  let visited = width

  while (queue.length) {
    const p = queue.pop()!
    const mask = getCoordMask(p.x, p.y, width)
    if (visited & mask) continue
    visited |= mask

    for (const nbr of getNeighbors(p)) {
      if (!contains(mino, nbr)) continue
      queue.push(nbr)
    }
  }
  // True if we have visited all the squares in the mino
  return visited === mino
}
