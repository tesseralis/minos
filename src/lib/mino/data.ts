import { range } from "lodash-es"
import Vector, { type VectorLike } from "../vector"
import type Polyomino from "./Polyomino"
import PointSet from "$lib/PointSet"

export type Dims = [number, number]
export type Coord = Vector

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Vector
}

export type RelativeLink = Required<PossibleRelativeLink>

export type MinoData = Set<number>

export function mask(x: number, y: number) {
  return (x << 16) | y
}
export function maskVec([x, y]: VectorLike) {
  return mask(x, y)
}

export function mx(mask: number) {
  return mask >> 16
}
export function my(mask: number) {
  return mask % (1 << 16)
}

export function unmask(m: number): [number, number] {
  return [mx(m), my(m)]
}

export function getWidth(mino: MinoData) {
  let min = Infinity
  let max = -Infinity
  for (const value of mino.values()) {
    min = Math.min(min, mx(value))
    max = Math.max(max, mx(value))
  }
  return max - min + 1
}

export function getHeight(mino: MinoData) {
  let min = Infinity
  let max = -Infinity
  for (const value of mino.values()) {
    min = Math.min(min, my(value))
    max = Math.max(max, my(value))
  }
  return max - min + 1
}

export function getKey(data: MinoData) {
  const xs = [...data.values()].sort()
  return xs.join(",")
}

export function addAll(mino: MinoData, items: Iterable<VectorLike>) {
  for (const p of items) {
    mino.add(maskVec(p))
  }
}

export function fromString(str: string) {
  const rows = str.split("_")
  const set = new Set<number>()
  for (const [x, row] of rows.entries()) {
    for (let y = 0; y < row.length; y++) {
      if (row[y] === "1") {
        set.add(mask(x, y))
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
        .map((y) => (mino.has(mask(x, y)) ? entry : empty))
        .join("")
    })
    .join(delimiter)
}

export function hasX(mino: MinoData, x: number) {
  return mino.values().some((v) => mx(v) === x)
}

export function hasY(mino: MinoData, y: number) {
  return mino.values().some((v) => my(v) === y)
}

export function addSquare(mino: MinoData, [x, y]: VectorLike) {
  if (x < 0) {
    const result = new Set(mino.values().map((m) => m + mask(1, 0)))
    result.add(mask(0, y))
    return result
  } else if (y < 0) {
    const result = new Set(mino.values().map((m) => m + mask(0, 1)))
    result.add(mask(x, 0))
    return result
  } else {
    const result = new Set(mino)
    result.add(mask(x, y))
    return result
  }
}

export function removeSquare(mino: MinoData, [x, y]: VectorLike) {
  const clone = new Set(mino)
  clone.delete(mask(x, y))
  if (!hasX(clone, 0)) {
    return new Set(clone.values().map((m) => m - mask(1, 0)))
  }
  if (!hasY(clone, 0)) {
    return new Set(clone.values().map((m) => m - mask(0, 1)))
  }
  return clone
}

export function isValid(mino: MinoData): boolean {
  const p0 = mino.values().next().value
  // the null-omino is not a valid polyomino
  if (p0 == null) return false
  const queue = [p0]

  const visited = new PointSet()

  while (queue.length) {
    const p = queue.pop()!
    const v = Vector.of(unmask(p))
    if (visited.has(v)) continue
    visited.add(v)

    for (const nbr of getNeighbors(v)) {
      if (!mino.has(maskVec(nbr))) continue
      queue.push(maskVec(nbr))
    }
  }
  // True if we have visited all the squares in the mino
  return visited.size === mino.size
}

/**
 * Return the neighbors of the coord [i,j]
 */
export function* getNeighbors(p: Vector): Generator<Vector> {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield p.add(Vector.DOWN)
  yield p.add(Vector.UP)
  yield p.add(Vector.RIGHT)
  yield p.add(Vector.LEFT)
}

export function* getKingwiseNeighbors(p: Vector): Generator<Vector> {
  yield* getNeighbors(p)
  yield p.add([1, 1])
  yield p.add([1, -1])
  yield p.add([-1, -1])
  yield p.add([-1, 1])
}
