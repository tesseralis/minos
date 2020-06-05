/**
 * Functions related to the direct manipulation of the underlying polyomino data.
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

// type for the encoded representation of a mino
export type MinoData = number
// type for the coordinates of a mino square
export type Coord = readonly [number, number]
// type for the dimensions of a mino
export type Dims = [number, number]

// The number of bits reserved for the width
export const WIDTH_BITS = 4
export const MAX_WIDTH = 1 << WIDTH_BITS

/**
 * Return the raw data portion of the mino.
 */
export function getData(mino: MinoData) {
  return mino >> WIDTH_BITS
}

export function getOrder(mino: MinoData) {
  let data = getData(mino)
  let size = 0
  while (data) {
    size += data & 1
    data = data >> 1
  }
  return size
}

export function getWidth(mino: MinoData) {
  return mino % MAX_WIDTH || MAX_WIDTH
}

export function getHeight(mino: MinoData) {
  const w = getWidth(mino)
  const data = getData(mino)
  return Math.floor(Math.log2(data) / w) + 1
}

/**
 * Return the mino given the data bits and the specified width
 */
export function fromBits(data: number, width: number): MinoData {
  return (data << WIDTH_BITS) | (width === MAX_WIDTH ? 0 : width)
}

/**
 * Iterate over the coordinates of the squares of the mino.
 */
export function* getCoords(mino: MinoData): Generator<Coord> {
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
 * Create a mino given a list of coordinates.
 */
export function fromCoords(coords: Coord[]) {
  const w = Math.max(...coords.map((p) => p[1])) + 1
  let result = 0
  for (const [i, j] of coords) {
    result = result | (1 << (w * i + j))
  }
  return fromBits(result, w)
}

/**
 * Get the coord `[i, j]` in the mino with width `w`.
 */
export function getCoordMask(i: number, j: number, w: number) {
  return 1 << (i * w + j + WIDTH_BITS)
}

/**
 * Returns true if the mino contains the given coordinate
 */
export function contains(mino: MinoData, [i, j]: Coord) {
  const w = getWidth(mino)
  if (i < 0 || j < 0 || j >= w) {
    return false
  }
  return !!(mino & getCoordMask(i, j, w))
}

/**
 * Get the bitmask corresponding to the jth column of the mino
 */
export function getColumnMask(mino: MinoData, j: number): number {
  const width = getWidth(mino)
  const height = getHeight(mino)
  let mask = 0
  for (let i = 0; i < height; i++) {
    mask |= getCoordMask(i, j, width)
  }
  return mino & mask
}

/**
 * Get the rows of the mino from bottom-up
 */
export function* rowBits(mino: MinoData): Generator<number> {
  const w = getWidth(mino)
  let data = getData(mino)
  while (data) {
    yield data % (1 << w)
    data >>= w
  }
}

interface DisplayOpts {
  block?: string
  space?: string
}

/**
 * Return the mino represented by the given delimited string:
 * e.g.
 * 100_111 =>
 * []
 * [][][]
 */
export function fromString(str: string) {
  const width = str.split("_")[0].length
  const bits = parseInt(str.replace(/_/g, ""), 2)
  return fromBits(bits, width)
}

/**
 * Return a pretty printed representation of the polyomino
 *
 * @param mino the polyomino object
 * @param block the string used to represent a filled block
 * @param space the string used to represent an unfilled block
 */
export function displayMino(mino: MinoData, opts: DisplayOpts = {}) {
  const { block = "□", space = " ️" } = opts
  const w = getWidth(mino)
  const result = []
  for (const row of rowBits(mino)) {
    const str = row.toString(2).padStart(w, "0")
    result.push([...str].join(" "))
  }
  return result.reverse().join("\n").replace(/1/g, block).replace(/0/g, space)
}
