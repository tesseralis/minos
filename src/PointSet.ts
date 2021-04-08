import Vector from "vector"

// TODO (refactor) naming convention is weird

/**
 * A class representing a set of (integer) vectors.
 */
export default class PointSet {
  data: boolean[][]
  size: number

  constructor() {
    this.data = []
    this.size = 0
  }

  add(p: Vector) {
    if (!this.data[p.x]) {
      this.data[p.x] = []
    }
    this.data[p.x][p.y] = true
    this.size++
  }

  addAll(ps: Iterable<Vector>) {
    for (const p of ps) {
      this.add(p)
    }
  }

  has(p: Vector): boolean {
    return !!this.data[p.x]?.[p.y]
  }
}
