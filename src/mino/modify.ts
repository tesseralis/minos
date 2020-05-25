/**
 * Utilities for adding and removing squares to and from minos.
 */

import {
  Mino,
  MAX_WIDTH,
  getMino,
  getData,
  getWidth,
  rowBits,
  getPointMask,
  getColumnMask,
} from "./mino"

import type { Point } from "math"

/**
 * Return the mino with the width adjusted by delta (e.g. +1 or -1)
 */
function adjustWidth(mino: Mino, delta: number): Mino {
  const w = getWidth(mino) + delta
  if (w > MAX_WIDTH) throw new Error("Already at maximum width")
  if (w < 1) throw new Error("Already at minimum width")
  let result = 0
  let i = 0

  for (const row of rowBits(mino)) {
    result |= row << (i * w)
    i++
  }
  return getMino(result, w)
}

function incWidth(mino: Mino): Mino {
  return adjustWidth(mino, +1)
}

function decWidth(mino: Mino): Mino {
  return adjustWidth(mino, -1)
}

function shiftLeft(mino: Mino): Mino {
  const expanded = incWidth(mino)
  const data = getData(expanded)

  return getMino(data << 1, getWidth(expanded))
}

function shiftRight(mino: Mino): Mino {
  const decremented = decWidth(mino)
  const data = getData(decremented)

  return getMino(data >> 1, getWidth(decremented))
}

function shiftDown(mino: Mino): Mino {
  const w = getWidth(mino)
  return getMino(getData(mino) >> w, w)
}

function shiftUp(mino: Mino): Mino {
  const w = getWidth(mino)
  return getMino(getData(mino) << w, w)
}

function doAdd(mino: Mino, i: number, j: number): Mino {
  return mino | getPointMask(i, j, getWidth(mino))
}

/**
 * Append the point [i,j] to the mino
 */
export function addSquare(mino: Mino, [i, j]: Point): Mino {
  if (i < 0) {
    return doAdd(shiftUp(mino), 0, j)
  }
  if (j < 0) {
    return doAdd(shiftLeft(mino), i, 0)
  }
  if (j === getWidth(mino)) {
    return doAdd(incWidth(mino), i, j)
  }
  // otherwise add the point value to the mino
  return doAdd(mino, i, j)
}

function bottomRowEmpty(mino: Mino): boolean {
  const row = [...rowBits(mino)][0]
  return !row
}

function rightColumnEmpty(mino: Mino): boolean {
  return !getColumnMask(mino, 0)
}

function leftColumnEmpty(mino: Mino): boolean {
  return !getColumnMask(mino, getWidth(mino) - 1)
}

function doRemove(mino: Mino, i: number, j: number): Mino {
  return mino & ~getPointMask(i, j, getWidth(mino))
}

/**
 * Remove the square at point [i, j] from the Mino
 */
export function removeSquare(mino: Mino, [i, j]: Point): Mino {
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
