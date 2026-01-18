import { ceildiv, floordiv } from "$lib/math"
import Vector, { type VectorLike } from "$lib/vector"
import {
  type Coord,
  copy,
  getHeight,
  MAX_WIDTH,
  rowBits,
  rowsPerWord,
  toString,
  type MinoData,
  getCoordMask,
  create,
} from "./dataArray"
import type Polyomino from "./Polyomino"

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Coord
}

export type RelativeLink = Required<PossibleRelativeLink>

// FIXME do this later; not necessary for graph
// export function removeSquare(mino: MinoData, width: number, coord: VectorLike) {
//   return mino
// }
// export function isValid(mino: MinoData, width: number) {
//   return false
// }
export function* getNeighbors(p: Coord): Generator<Coord> {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield p.add(Vector.DOWN)
  yield p.add(Vector.UP)
  yield p.add(Vector.RIGHT)
  yield p.add(Vector.LEFT)
}

/**
 * Append the square [i, j] to the mino
 */
export function addSquare(mino: MinoData, [i, j]: VectorLike) {
  if (i < 0) {
    return doAdd(shiftRowStart(mino), 0, j)
  }
  // FIXME larger mino if go down
  if (j < 0) {
    return doAdd(shiftColStart(mino), i, 0)
  }
  if (j === mino.width) {
    return doAdd(incWidth(mino), i, j)
  }
  return doAdd(copy(mino), i, j)
}

// Do the actual addition
function doAdd(mino: MinoData, i: number, j: number) {
  const rpw = rowsPerWord(mino.width)
  mino[floordiv(i, rpw)] |= getCoordMask(i % rpw, j, mino.width)
  return mino
}

function adjustWidth(mino: MinoData, delta: number): MinoData {
  const width = mino.width
  const newWidth = width + delta
  let rpw = rowsPerWord(newWidth)
  const height = getHeight(mino)
  const clone = new Uint32Array(ceildiv(height, rpw))
  if (newWidth >= MAX_WIDTH) throw new Error("Already at max width")
  if (newWidth < 1) throw new Error("Already at minimum width")

  let i = 0
  for (const row of rowBits(mino)) {
    clone[floordiv(i, rpw)] |= row << ((i % rpw) * newWidth)
    i++
  }
  ;(clone as any).width = newWidth
  return clone as MinoData
}

function incWidth(mino: MinoData) {
  return adjustWidth(mino, +1)
}

function shiftColStart(mino: MinoData) {
  const expanded = incWidth(mino)
  for (let i = 0; i < expanded.length; i++) {
    expanded[i] <<= 1
  }
  return expanded
}

function shiftRowStart(mino: MinoData): MinoData {
  const width = mino.width
  let clone
  if (getHeight(mino) === width * mino.length) {
    clone = new Uint32Array(mino.length + 1)
    clone.set(mino)
  } else {
    clone = mino.slice()
  }
  let remainder = 0
  const rpw = rowsPerWord(width)
  const trueWordLength = rpw * width
  for (let i = 0; i < mino.length; i++) {
    const oldRemainder = remainder
    remainder = clone[i] >> ((rpw - 1) * width)
    clone[i] = (clone[i] << width) | oldRemainder
    if (trueWordLength !== MAX_WIDTH) {
      clone[i] %= 1 << trueWordLength
    }
  }

  return create(clone, mino.width)
}
