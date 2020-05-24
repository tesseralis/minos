/**
 * Functions related to the generation and manipulation of polyominoes.
 *
 * Minos are encoded as a combination of a value and a width flag:
 *
 * 0100_0111_0100
 * ^ value   ^ width
 *
 * This describes the L tetromino:
 *
 * []
 * [][][]
 *
 * The last four bits represent the width of the mino and how the remaining bits
 * should be interpreted. The value `11_0001` represents the vertical domino:
 *
 * []
 * []
 *
 * while the value `11_0010` represents the horizontal domino:
 *
 * [][]
 *
 * This encoding was chosen so that operations on polyominoes can be done using efficient
 * bit-shift operations instead of heavier operations on arrays and sets.
 */

import type { Point } from "math"

export type Mino = number
export type Dims = [number, number]

// The number of bits reserved for the width
export const WIDTH_BITS = 4
export const MAX_WIDTH = 1 << WIDTH_BITS

/**
 * Return the raw data portion of the mino.
 */
export function getData(mino: Mino) {
  return mino >> WIDTH_BITS
}

export function getSize(mino: Mino) {
  let data = getData(mino)
  let size = 0
  while (data) {
    size += data & 1
    data = data >> 1
  }
  return size
}

export function getWidth(mino: Mino) {
  return mino % MAX_WIDTH || MAX_WIDTH
}

export function getHeight(mino: Mino) {
  const w = getWidth(mino)
  const data = getData(mino)
  return Math.floor(Math.log2(data) / w) + 1
}

/**
 * Get the width and height of the mino
 */
export function getShape(mino: Mino): Dims {
  return [getWidth(mino), getHeight(mino)]
}

/**
 * Return the mino given the data bits and the specified width
 */
export function getMino(data: number, width: number): Mino {
  return (data << WIDTH_BITS) | (width === MAX_WIDTH ? 0 : width)
}

export const MONOMINO = getMino(1, 1)

/**
 * Return the mino as a set of coordinate points.
 */
export function* getPoints(mino: Mino): Generator<Point> {
  let data = getData(mino)
  const w = getWidth(mino)
  let k = 0
  while (data) {
    if (data & 1) {
      yield [(k / w) >> 0, k % w]
    }
    k++
    data = data >> 1
  }
}

/**
 * Create a mino given a list of coordinate points.
 */
export function fromPoints(points: Point[]) {
  const w = Math.max(...points.map((p) => p[1])) + 1
  let result = 0
  for (const [i, j] of points) {
    result = result | (1 << (w * i + j))
  }
  return getMino(result, w)
}

/**
 * Get the point `[i, j]` in the mino with width `w`.
 */
export function getPointMask(i: number, j: number, w: number) {
  return 1 << (i * w + j + WIDTH_BITS)
}

/**
 * Returns true if the mino contains the given point
 */
export function contains(mino: Mino, [i, j]: Point) {
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

export function isValid(mino: Mino): boolean {
  const p0 = [...getPoints(mino)][0]
  // the null-omino is not a valid polyomino
  if (!p0) return false
  const queue = [p0]
  const width = getWidth(mino)

  // Initialize the visited bitmask
  // Include the mino's width so that we can easily compare later
  let visited = width

  while (queue.length) {
    const p = queue.pop()!
    const [i, j] = p
    const mask = getPointMask(i, j, width)
    if (visited & mask) continue
    visited |= mask

    for (const nbr of nbrs(p)) {
      if (!contains(mino, nbr)) continue
      queue.push(nbr)
    }
  }
  // True if we have visited all the squares in the mino
  return visited === mino
}

/**
 * Get the bitmask corresponding to the jth column of the mino
 */
export function getColumnMask(mino: Mino, j: number): number {
  const [width, height] = getShape(mino)
  let mask = 0
  for (let i = 0; i < height; i++) {
    mask |= getPointMask(i, j, width)
  }
  return mino & mask
}

/**
 * Get the rows of the mino from bottom-up
 */
export function* rowBits(mino: Mino): Generator<number> {
  const w = getWidth(mino)
  let data = getData(mino)
  while (data) {
    yield data % (1 << w)
    data >>= w
  }
}

function padLeft(str: string, char: string, width: number) {
  if (str.length >= width) {
    return str
  }
  return char.repeat(width - str.length) + str
}

interface DisplayOpts {
  block?: string
  space?: string
}

/**
 * Return a pretty printed representation of the polyomino
 *
 * @param mino the polyomino object
 * @param block the string used to represent a filled block
 * @param space the string used to represent an unfilled block
 */
export function displayMino(mino: Mino, opts: DisplayOpts = {}) {
  const { block = "□", space = " ️" } = opts
  const w = getWidth(mino)
  const result = []
  for (const row of rowBits(mino)) {
    const str = padLeft(row.toString(2), "0", w)
    result.push([...str].join(" "))
  }
  return result.reverse().join("\n").replace(/1/g, block).replace(/0/g, space)
}
