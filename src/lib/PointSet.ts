import { entries, range } from "lodash-es"
import Vector, { type VectorLike } from "./vector"

/**
 * A class representing a set of (integer) vectors.
 */
export default class PointSet {
  data: Map<number, Set<number>>
  size: number
  minX: number = 0
  maxX: number = 0
  minY: number = 0
  maxY: number = 0

  constructor() {
    this.data = new Map()
    this.size = 0
  }

  copy() {
    const copy = new PointSet()
    copy.data = new Map(
      this.data.entries().map(([x, set]) => [x, new Set(set)]),
    )
    copy.size = this.size
    copy.minX = this.minX
    copy.minY = this.minY
    copy.maxX = this.maxX
    copy.maxY = this.maxY
    return copy
  }

  transform(fx: (n: number) => number, fy: (n: number) => number) {
    const result = new PointSet()
    result.data = new Map(
      this.data.entries().map(([x, ys]) => {
        return [fx(x), new Set(ys.values().map((y) => fy(y)))]
      }),
    )
    result.size = this.size
    const newMinX = fx(this.minX)
    const newMaxX = fx(this.maxX)
    result.minX = Math.min(newMinX, newMaxX)
    result.maxX = Math.max(newMinX, newMaxX)
    const newMinY = fy(this.minY)
    const newMaxY = fy(this.maxY)
    result.minY = Math.min(newMinY, newMaxY)
    result.maxY = Math.max(newMinY, newMaxY)
    return result
  }

  translate([x1, y1]: VectorLike) {
    return this.transform(
      (x) => x + x1,
      (y) => y + y1,
    )
  }

  add([x, y]: VectorLike) {
    if (!this.data.has(x)) {
      this.data.set(x, new Set())
    }
    this.data.get(x)!.add(y)
    this.size++
    if (this.size === 1) {
      this.minX = this.maxX = x
      this.minY = this.maxY = y
    } else {
      this.minX = Math.min(this.minX, x)
      this.maxX = Math.max(this.maxX, x)
      this.minY = Math.min(this.minY, y)
      this.maxY = Math.max(this.maxY, y)
    }
  }

  addAll(ps: Iterable<VectorLike>) {
    for (const p of ps) {
      this.add(p)
    }
  }

  remove([x, y]: VectorLike) {
    this.data.get(x)?.delete(y)
    if (this.data.get(x)?.size === 0) {
      this.data.delete(x)
    }
    this.size--
    if (x === this.minX) {
      this.minX = Math.min(this.minX, ...this.data.keys())
    }
    if (x === this.maxX) {
      this.maxX = Math.max(this.maxX, ...this.data.keys())
    }
    if (y === this.minY) {
      this.minY = Math.min(this.minY, ...this.data.values().flatMap((y) => y))
    }
    if (y === this.maxY) {
      this.maxY = Math.max(this.maxY, ...this.data.values().flatMap((y) => y))
    }
  }

  hasX(x: number) {
    return this.data.has(x)
  }

  hasY(y: number) {
    return this.data.values().some((set) => set.has(y))
  }

  has([x, y]: VectorLike): boolean {
    return !!this.data.get(x)?.has(y)
  }

  *values() {
    for (const [x, value] of this.data.entries()) {
      for (const y of value.values()) {
        yield new Vector(+x, +y)
      }
    }
  }

  get width() {
    return this.maxX - this.minX + 1
  }
  get height() {
    return this.maxY - this.minY + 1
  }

  key() {
    const xs = [...this.data.keys()].sort()
    return xs
      .map((x) => `${x}:${[...this.data.get(x)!].sort().join(",")}`)
      .join(" ")
  }

  toString(entry = "1", empty = "0", delimiter = "_") {
    if (this.minX < 0 || this.minY < 0) {
      console.log(this.data)
      throw new Error("Cannot stringify")
    }
    return range(this.height)
      .map((y) => {
        return range(this.width)
          .map((x) => (this.has([x, y]) ? entry : empty))
          .join("")
      })
      .join(delimiter)
  }
}
