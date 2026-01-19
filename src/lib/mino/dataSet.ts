import { range } from "lodash-es"
import { type VectorLike } from "../vector"

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
  for (let value of mino.values()) {
    min = Math.min(min, mx(value))
    max = Math.max(max, mx(value))
  }
  return max - min + 1
}

export function getHeight(mino: MinoData) {
  let min = Infinity
  let max = -Infinity
  for (let value of mino.values()) {
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

export function display(
  mino: MinoData,
  entry = "1",
  empty = "0",
  delimiter = "_",
) {
  return range(getHeight(mino))
    .map((y) => {
      return range(getWidth(mino))
        .map((x) => (mino.has(mask(x, y)) ? entry : empty))
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
