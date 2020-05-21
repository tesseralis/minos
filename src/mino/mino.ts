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
export function displayMino(
  mino: Mino,
  { block = "□", space = " ️" }: DisplayOpts,
) {
  const w = getWidth(mino)
  let data = getData(mino)
  const result = []
  while (data) {
    const row = data % (1 << w)
    const str = padLeft(row.toString(2), "0", w)
    result.push([...str].join(" "))
    data = data >> w
  }
  return result.reverse().join("\n").replace(/1/g, block).replace(/0/g, space)
}

export function printMino(mino: Mino, opts: DisplayOpts = {}) {
  console.log(displayMino(mino, opts))
}
