import { remove } from "$lib/components/MinoList/MinoFilter/common"
import { ceildiv, floordiv } from "$lib/math"
import PointSet from "$lib/PointSet"
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
  getColumnMask,
  create,
  getCoords,
  contains,
  getOrder,
} from "./dataArray"
import type Polyomino from "./Polyomino"

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Coord
}

export type RelativeLink = Required<PossibleRelativeLink>

export function removeSquare(mino: MinoData, [i, j]: VectorLike) {
  const removed = doRemove(mino, i, j)
  if (rowStartEmpty(removed)) {
    return unshiftRow(removed)
  } else if (columnStartEmpty(removed)) {
    return unshiftColumn(removed)
  } else if (columnEndEmpty(removed)) {
    return decWidth(removed)
  }
  return removed
}

export function isValid(mino: MinoData) {
  const p0 = [...getCoords(mino)][0]
  if (!p0) return false
  const queue = [p0]

  // Make a copy with the mino
  // let visited = create(new Uint32Array(mino.length), mino.width)
  let visited = new PointSet()

  while (queue.length) {
    const p = queue.pop()!
    if (visited.has(p)) continue
    visited.add(p)

    for (const nbr of getNeighbors(p)) {
      if (!contains(mino, nbr)) continue
      queue.push(nbr)
    }
  }
  return visited.size === getOrder(mino)
}

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
    return doAdd(shiftRow(mino), 0, j)
  }
  // FIXME larger mino if go down
  if (j < 0) {
    return doAdd(shiftColumn(mino), i, 0)
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

function doRemove(mino: MinoData, i: number, j: number) {
  const result = mino.slice()
  const rpw = rowsPerWord(mino.width)
  result[floordiv(i, rpw)] &= ~getCoordMask(i % rpw, j, mino.width)
  return create(result, mino.width)
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
  return create(clone, newWidth)
}

function incWidth(mino: MinoData) {
  return adjustWidth(mino, +1)
}

function decWidth(mino: MinoData) {
  return adjustWidth(mino, -1)
}

function shiftColumn(mino: MinoData) {
  const expanded = incWidth(mino)
  for (let i = 0; i < expanded.length; i++) {
    expanded[i] <<= 1
  }
  return expanded
}

function unshiftColumn(mino: MinoData) {
  for (let i = 0; i < mino.length; i++) {
    mino[i] >>= 1
  }
  return decWidth(mino)
}

function shiftRow(mino: MinoData): MinoData {
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

function unshiftRow(mino: MinoData): MinoData {
  const width = mino.width
  let result =
    (mino.at(-1) ?? 0) >> width
      ? mino
      : create(new Uint32Array(mino.length - 1), width)
  const remainderShift = (rowsPerWord(width) - 1) * width
  for (let i = 0; i < mino.length; i++) {
    const remainder = (mino[i + 1] || 0) % (1 << width)
    result[i] = (mino[i] >> width) | (remainder << remainderShift)
  }
  return result
}

function rowStartEmpty(mino: MinoData): boolean {
  return !(mino[0] % (1 << mino.width))
}

function columnStartEmpty(mino: MinoData): boolean {
  return mino.every((word) => !getColumnMask(word, 0, mino.width))
}

function columnEndEmpty(mino: MinoData): boolean {
  return mino.every((word) => !getColumnMask(word, mino.width - 1, mino.width))
}
