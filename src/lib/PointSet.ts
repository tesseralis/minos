import { cloneDeep, mapKeys, range } from "lodash-es"
import Vector, { type VectorLike } from "./vector"

/**
 * A class representing a set of (integer) vectors.
 */
export default class PointSet {
  data: Record<number, Record<number, boolean>>
  size: number
  minX: number = 0
  maxX: number = 0
  minY: number = 0
  maxY: number = 0

  constructor() {
    this.data = {}
    this.size = 0
  }

  copy() {
    const copy = new PointSet()
    // copy.data = cloneDeep(this.data)
    copy.addAll(this.values())
    return copy
  }

  translate([x1, y1]: VectorLike) {
    this.data = Object.fromEntries(
      Object.entries(this.data).map(([x, ys]) => {
        return [+x + x1, mapKeys(ys, (_, y) => +y + y1)]
      }),
    )
    this.minX += x1
    this.minY += y1
    this.maxX += x1
    this.maxY += y1
  }

  add([x, y]: VectorLike) {
    if (!this.data[x]) {
      this.data[x] = {}
    }
    this.data[x][y] = true
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

  has([x, y]: VectorLike): boolean {
    return !!this.data[x]?.[y]
  }

  *values() {
    for (const [x, value] of Object.entries(this.data)) {
      for (const y of Object.keys(value)) {
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
