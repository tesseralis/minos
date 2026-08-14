import { range } from "lodash-es"
import Vector, { type VectorLike } from "../vector"
import type Polyomino from "./Polyomino"

export type Dims = [number, number]
export type Coord = Vector
// TODO deduplicate with the definition in 'edges'
export const directions = ["left", "right", "up", "down"] as const
export type Direction = (typeof directions)[number]

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Vector
}

export type RelativeLink = Required<PossibleRelativeLink>

const INT_WIDTH = 16
export type PackedPoint = number

/**
 * The underlying representation for a polyomino, a set of coordinates,
 * but because JavaScript is silly we're packing the coordinates as 16-bit unsigned integers.
 */
export type MinoData = Set<PackedPoint>

function toi16(n: number) {
  return n & ((1 << INT_WIDTH) - 1)
}

/** Encode a pair of coordinates */
export function encode(x: number, y: number) {
  return (toi16(x) << INT_WIDTH) | toi16(y)
}

/** Encode an array, tuple, or vector */
export function encodeVec([x, y]: VectorLike) {
  return encode(x, y)
}

/** Get the x component of the encoded point */
export function px(p: PackedPoint) {
  return p >> INT_WIDTH
}
export function py(p: PackedPoint) {
  let y = p & ((1 << INT_WIDTH) - 1)
  return y & (1 << (INT_WIDTH - 1)) ? y | (-1 << 16) : y
}

/** Decode a packed point into its x and y components */
export function decode(m: PackedPoint): [number, number] {
  return [px(m), py(m)]
}

export function getDims(mino: MinoData) {
  let xMin = Infinity
  let xMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity
  for (const value of mino.values()) {
    xMin = Math.min(xMin, px(value))
    xMax = Math.max(xMax, px(value))
    yMin = Math.min(yMin, py(value))
    yMax = Math.max(yMax, py(value))
  }
  return encode(xMax - xMin + 1, yMax - yMin + 1)
}

export function getWidth(mino: MinoData) {
  let min = Infinity
  let max = -Infinity
  for (const value of mino.values()) {
    min = Math.min(min, px(value))
    max = Math.max(max, px(value))
  }
  return max - min + 1
}

export function getHeight(mino: MinoData) {
  let min = Infinity
  let max = -Infinity
  for (const value of mino.values()) {
    min = Math.min(min, py(value))
    max = Math.max(max, py(value))
  }
  return max - min + 1
}

// Get a unique key for the encoded data.
// Used for caching polyominoes.
export function getKey(data: MinoData) {
  const xs = [...data.values()].sort()
  return xs.join(",")
}

export function addAll(mino: MinoData, items: Iterable<VectorLike>) {
  for (const p of items) {
    mino.add(encodeVec(p))
  }
}

export function move(
  point: PackedPoint,
  dir: Direction,
  width?: number,
  height?: number,
): PackedPoint | undefined {
  const x = px(point)
  const y = py(point)
  switch (dir) {
    case "left": {
      if (x === 0) return
      return point - encode(1, 0)
    }
    case "right": {
      if (width && x === width - 1) return
      return point + encode(1, 0)
    }
    case "up": {
      if (py(point) === 0) return
      return point - encode(0, 1)
    }
    case "down": {
      if (height && y === height - 1) return
      return point + encode(0, 1)
    }
  }
}

export function fromString(str: string) {
  const rows = str.split("_")
  const set = new Set<number>()
  for (const [x, row] of rows.entries()) {
    for (let y = 0; y < row.length; y++) {
      if (row[y] === "1") {
        set.add(encode(x, y))
      }
    }
  }
  return set
}

export function display(
  mino: MinoData,
  entry = "1",
  empty = "0",
  delimiter = "_",
) {
  return range(getWidth(mino))
    .map((x) => {
      return range(getHeight(mino))
        .map((y) => (mino.has(encode(x, y)) ? entry : empty))
        .join("")
    })
    .join(delimiter)
}

export function hasX(mino: MinoData, x: number) {
  return mino.values().some((v) => px(v) === x)
}

export function hasY(mino: MinoData, y: number) {
  return mino.values().some((v) => py(v) === y)
}

export function addSquare(mino: MinoData, p: PackedPoint) {
  const x = px(p)
  const y = py(p)
  if (x < 0) {
    const result = new Set(mino.values().map((m) => m + encode(1, 0)))
    result.add(encode(0, y))
    return result
  } else if (y < 0) {
    const result = new Set(mino.values().map((m) => m + encode(0, 1)))
    result.add(encode(x, 0))
    return result
  } else {
    const result = new Set(mino)
    result.add(p)
    return result
  }
}

export function removeSquare(mino: MinoData, [x, y]: VectorLike) {
  const clone = new Set(mino)
  clone.delete(encode(x, y))
  if (!hasX(clone, 0)) {
    return new Set(clone.values().map((m) => m - encode(1, 0)))
  }
  if (!hasY(clone, 0)) {
    return new Set(clone.values().map((m) => m - encode(0, 1)))
  }
  return clone
}

/** Whether this set represnts a valid polyomino. */
export function isValid(mino: MinoData): boolean {
  const p0 = mino.values().next().value
  // the null-omino is not a valid polyomino
  if (p0 == null) return false
  const queue = [p0]

  const visited = new Set()

  while (queue.length) {
    const p = queue.pop()!
    if (visited.has(p)) continue
    visited.add(p)

    for (const nbr of rawNeighbors(p)) {
      if (!mino.has(nbr)) continue
      queue.push(nbr)
    }
  }
  // True if we have visited all the squares in the mino
  return visited.size === mino.size
}

export function* rawNeighbors(p: PackedPoint): Generator<PackedPoint> {
  yield p + 1 // down
  yield encode(px(p), py(p) - 1) // up
  yield p + (1 << INT_WIDTH) // right
  yield encode(px(p) - 1, py(p)) // left
}

/** Return the neighbors of the coord [i,j] */
export function* getNeighbors(p: Coord): Generator<Coord> {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield p.add(Vector.DOWN)
  yield p.add(Vector.UP)
  yield p.add(Vector.RIGHT)
  yield p.add(Vector.LEFT)
}

/** Iterate over the orthogonal and diagonal neighbors of p */
export function* getKingwiseNeighbors(p: Coord): Generator<Coord> {
  yield* getNeighbors(p)
  yield p.add([1, 1])
  yield p.add([1, -1])
  yield p.add([-1, -1])
  yield p.add([-1, 1])
}
