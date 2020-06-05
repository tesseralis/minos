/**
 * Utilities for adding and removing squares to and from mino data.
 */

import {
  MinoData,
  Coord,
  MAX_WIDTH,
  fromBits,
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
export function addSquare(mino: MinoData, [i, j]: Coord): MinoData {
  if (i < 0) {
    return doAdd(shiftUp(mino), 0, j)
  }
  if (j < 0) {
    return doAdd(shiftLeft(mino), i, 0)
  }
  if (j === getWidth(mino)) {
    return doAdd(incWidth(mino), i, j)
  }
  return doAdd(mino, i, j)
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
export function removeSquare(mino: MinoData, [i, j]: Coord): MinoData {
  const removed = doRemove(mino, i, j)
  if (bottomRowEmpty(removed)) {
    return shiftDown(removed)
  } else if (rightColumnEmpty(removed)) {
    return shiftRight(removed)
  } else if (leftColumnEmpty(removed)) {
    return decWidth(removed)
  }
  return removed
}
