import { range } from "lodash-es"
import Vector, { type VectorLike } from "./vector"

/**
 * A class representing a set of (integer) vectors.
 */
export default class MinoPointSet {
  data: Set<number>

  constructor() {
    this.data = new Set()
  }

  copy() {
    const copy = new MinoPointSet()
    copy.data = new Set(this.data)
    return copy
  }

  transform(f: (p: VectorLike) => VectorLike) {
    const result = new MinoPointSet()
    result.data = new Set(
      this.data.values().map((m) => {
        return mask(f(unmask(m)))
      }),
    )
    return result
  }

  translate([x1, y1]: VectorLike) {
    return this.transform(([x, y]) => [x + x1, y + y1])
  }

  addRaw(m: number) {
    this.data.add(m)
  }

  add(p: VectorLike) {
    this.addRaw(mask(p))
  }

  addAllRaw(ms: Iterable<number>) {
    for (const m of ms) {
      this.addRaw(m)
    }
  }

  addAll(ps: Iterable<VectorLike>) {
    for (const p of ps) {
      this.add(p)
    }
  }

  remove(p: VectorLike) {
    const [x, y] = p
    this.data.delete(mask(p))
  }

  hasX(x: number) {
    return this.data.values().some((v) => mx(v) === x)
  }

  hasY(y: number) {
    return this.data.values().some((v) => my(v) === y)
  }

  has(p: VectorLike): boolean {
    return this.data.has(mask(p))
  }

  *rawValues() {
    yield* this.data.values()
  }

  *values() {
    yield* this.data.values().map((m) => Vector.fromArray(unmask(m)))
  }

  get width() {
    let min = Infinity
    let max = -Infinity
    for (let value of this.data.values()) {
      min = Math.min(min, mx(value))
      max = Math.max(max, mx(value))
    }
    return max - min + 1
  }
  get height() {
    let min = Infinity
    let max = -Infinity
    for (let value of this.data.values()) {
      min = Math.min(min, my(value))
      max = Math.max(max, my(value))
    }
    return max - min + 1
  }

  key() {
    const xs = [...this.data.values()].sort()
    return xs.join(",")
  }

  toString(entry = "1", empty = "0", delimiter = "_") {
    return range(this.height)
      .map((y) => {
        return range(this.width)
          .map((x) => (this.has([x, y]) ? entry : empty))
          .join("")
      })
      .join(delimiter)
  }
}

function mask([x, y]: VectorLike) {
  return (x << 16) | y
}

function mx(mask: number) {
  return mask >> 16
}
function my(mask: number) {
  return mask % (1 << 16)
}

function unmask(m: number): [number, number] {
  return [mx(m), my(m)]
}
