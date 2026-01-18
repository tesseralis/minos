import { ceildiv, floordiv } from "$lib/math"
import type { VectorLike } from "$lib/vector"
import { sum } from "lodash-es"
import Vector from "$lib/vector"

export type MinoData = Uint32Array & { width: number }
// type for the coordinates of a mino square
export type Coord = Vector
// type for the dimensions of a mino
export type Dims = [number, number]

export type MinoKey = string

export const MAX_WIDTH = 32

export function create(data: Uint32Array, width: number) {
  ;(data as any).width = width
  return data as MinoData
}
export function copy(mino: MinoData) {
  return create(mino.slice(0), mino.width)
}

export function getOrder(mino: MinoData) {
  return sum(mino.map(getOnesCount))
}

function getOnesCount(n: number) {
  let size = 0
  while (n) {
    size += n & 1
    n = n >> 1
  }
  return size
}

export function getKey(mino: MinoData): MinoKey {
  let key = mino.width.toString(16).padStart(2, "0")
  for (let word of mino) {
    while (word) {
      key += (word % (1 << 4)).toString(16)
      word >>= 4
    }
  }
  return key
}

export function getHeight(mino: MinoData) {
  const width = mino.width
  const first = floordiv(MAX_WIDTH, width) * (mino.length - 1)
  const last = getSingleHeight(mino.at(-1) ?? 0, width)
  return first + last
}

function getSingleHeight(n: number, width: number) {
  return Math.floor(Math.log2(n) / width) + 1
}

export function contains(mino: MinoData, [i, j]: VectorLike) {
  const width = mino.width
  if (i < 0 || j < 0 || j >= width) {
    return false
  }
  const rpw = rowsPerWord(width)
  return !!(mino[floordiv(i, rpw)] & getCoordMask(i % rpw, j, width))
}

export function getCoordMask(i: number, j: number, width: number) {
  return 1 << (i * width + j)
}

export function getColumnMask(word: number, j: number, width: number) {
  let mask = 0
  for (let i = 0; i < rowsPerWord(width); i++) {
    mask |= getCoordMask(i, j, width)
  }
  return word & mask
}

export function* getCoords(mino: MinoData): Generator<Coord> {
  const width = mino.width
  const rpw = rowsPerWord(width)
  for (let [i, word] of mino.entries()) {
    let k = 0
    while (word) {
      if (word & 1) {
        yield new Vector(i * rpw + floordiv(k, width), k % width)
      }
      k++
      word >>= 1
    }
  }
}
export function fromCoords(coords: VectorLike[]) {
  // return create(new Uint32Array([1]), 1)
  // TODO dedupe
  const w = Math.max(...coords.map(([, y]) => y)) + 1
  const h = Math.max(...coords.map(([x]) => x)) + 1
  const rpw = rowsPerWord(w)
  const result = new Uint32Array(ceildiv(h, rpw))
  for (const [i, j] of coords) {
    result[floordiv(i, rpw)] |= 1 << (w * (i % rpw) + j)
  }
  return create(result, w)
}

export function* rowBits(mino: MinoData): Generator<number> {
  for (let word of mino) {
    while (word) {
      yield word % (1 << mino.width)
      word >>= mino.width
    }
  }
}

interface DisplayOpts {
  block?: string
  space?: string
}
export function displayMino(mino: MinoData, opts: DisplayOpts = {}) {
  const { block = "□", space = " " } = opts
  const w = mino.width
  const result = []
  for (const row of rowBits(mino)) {
    const str = row.toString(2).padStart(w, "0")
    result.push([...str].join(" "))
  }
  return result.reverse().join("\n").replace(/1/g, block).replace(/0/g, space)
}

export function fromString(str: string) {
  // return create(new Uint32Array([1]), 1)
  const width = str.split("_")[0].length
  // FIXME this isn't going to work for longer ones
  const bits = parseInt(str.replace(/_/g, ""), 2)
  return create(new Uint32Array([bits]), width)
}

export function toString(mino: MinoData) {
  const strs: string[] = []
  for (const row of rowBits(mino)) {
    strs.push(row.toString(2).padStart(mino.width, "0"))
  }
  return strs.reverse().join("_")
}
// export function getCoordMask(data: MinoData) {}
// export function getColumnMask(data: MinoData) {}

export function rowsPerWord(width: number) {
  return floordiv(MAX_WIDTH, width)
}
