import { range } from "lodash-es"
import { type VectorLike } from "../vector"
import type Polyomino from "./Polyomino"

export type Dims = [number, number]
// TODO deduplicate with the definition in 'edges'
export const directions = ["left", "right", "up", "down"] as const
export type Direction = (typeof directions)[number]

const INT_WIDTH = 16

/*
 * A 32-bit integer representing two packed 16 bit integers.
 * We're going to be using integer coordinates a lot, and being able to manipulate them as numbers
 * instead of creating objects avoids a lot of allocation and GC.
 */
export type PackedPoint = number
export type Coord = PackedPoint

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Coord
}

export type RelativeLink = Required<PossibleRelativeLink>

/**
 * The underlying representation for a polyomino, a set of coordinates,
 * but because JavaScript is silly we're packing the coordinates as 16-bit signed integers.
 */
export type MinoData = PackedPoint[]

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
  for (const value of mino) {
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
  for (const value of mino) {
    min = Math.min(min, px(value))
    max = Math.max(max, px(value))
  }
  return max - min + 1
}

export function getHeight(mino: MinoData) {
  let min = Infinity
  let max = -Infinity
  for (const value of mino) {
    min = Math.min(min, py(value))
    max = Math.max(max, py(value))
  }
  return max - min + 1
}

// Get a unique key for the encoded data.
// Used for caching polyominoes.
export function getKey(data: MinoData) {
  const xs = data.toSorted()
  return xs.join(",")
}

// Assumes positive coord
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
      return point - Directions.RIGHT
    }
    case "right": {
      if (width && x === width - 1) return
      return point + Directions.RIGHT
    }
    case "up": {
      if (py(point) === 0) return
      return point - Directions.DOWN
    }
    case "down": {
      if (height && y === height - 1) return
      return point + Directions.DOWN
    }
  }
}

export function fromString(str: string) {
  const rows = str.split("_")
  const set = []
  for (const [x, row] of rows.entries()) {
    for (let y = 0; y < row.length; y++) {
      if (row[y] === "1") {
        set.push(encode(x, y))
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
        .map((y) => (mino.includes(encode(x, y)) ? entry : empty))
        .join("")
    })
    .join(delimiter)
}

export function hasX(mino: MinoData, x: number) {
  return mino.some((v) => px(v) === x)
}

export function hasY(mino: MinoData, y: number) {
  return mino.some((v) => py(v) === y)
}

export function addSquare(mino: MinoData, p: PackedPoint) {
  const x = px(p)
  const y = py(p)
  if (x < 0) {
    const result = mino.map((m) => m + Directions.RIGHT)
    result.push(encode(0, y))
    return result
  } else if (y < 0) {
    const result = mino.map((m) => m + Directions.DOWN)
    result.push(encode(x, 0))
    return result
  } else {
    return [...mino, p]
  }
}

export function removeSquare(mino: MinoData, p: Coord) {
  const clone = mino.filter((c) => c !== p)
  if (!hasX(clone, 0)) {
    return clone.map((m) => m - encode(1, 0))
  }
  if (!hasY(clone, 0)) {
    return clone.map((m) => m - encode(0, 1))
  }
  return clone
}

/** Whether this set represnts a valid polyomino. */
export function isValid(mino: MinoData): boolean {
  const p0 = mino[0]
  // the null-omino is not a valid polyomino
  if (p0 == null) return false
  const queue = [p0]

  const visited = new Set()

  while (queue.length) {
    const p = queue.pop()!
    if (visited.has(p)) continue
    visited.add(p)

    for (const nbr of neighbors(p)) {
      if (!mino.includes(nbr)) continue
      queue.push(nbr)
    }
  }
  // True if we have visited all the squares in the mino
  return visited.size === mino.length
}

export function add(a: PackedPoint, b: PackedPoint) {
  return encode(px(a) + px(b), py(a) + py(b))
}

export function sub(a: PackedPoint, b: PackedPoint) {
  return encode(px(a) - px(b), py(a) - py(b))
}

export const Directions = {
  ZERO: 0,
  DOWN: encode(0, 1),
  UP: encode(0, -1),
  LEFT: encode(-1, 0),
  RIGHT: encode(1, 0),
}

export function* neighbors(p: PackedPoint): Generator<PackedPoint> {
  yield p + Directions.DOWN
  yield add(p, Directions.UP)
  yield p + Directions.RIGHT
  yield add(p, Directions.LEFT)
}

export function* kingwiseNeighbors(p: PackedPoint): Generator<PackedPoint> {
  yield* neighbors(p)
  yield p + encode(1, 1)
  yield encode(px(p) + 1, py(p) - 1)
  yield encode(px(p) - 1, py(p) - 1)
  yield encode(px(p) - 1, py(p) + 1)
}
