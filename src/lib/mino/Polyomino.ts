import { partition, sum } from "lodash-es"
import Vector, { type VectorLike } from "$lib/vector"
import { getEdges, getEdgesInner } from "./outline"
// Import relative to the index to avoid circular dependency
import { MinoTransform, MinoClasses, MinoTilings } from "./internal"
import {
  display,
  getKey,
  addSquare,
  removeSquare,
  isValid,
  type MinoData,
  type RelativeLink,
  type PackedPoint,
  fromString,
  move,
  encode,
  getDims,
  px,
  py,
  directions,
  neighbors,
  kingwiseNeighbors,
} from "./data"
import { flip, type Direction } from "./edges"

// cache of all created minos
const cache: Record<string, Polyomino> = {}

// type of stuff that can be cast into a Polyomino
export type MinoLike = string | VectorLike[] | Polyomino

export default class Polyomino {
  data: MinoData
  dataSet: Set<PackedPoint>
  /** The number of squares in this polyomino */
  order: number

  /** Polyomino dimensions */
  rawDims: PackedPoint

  classes: MinoClasses
  transform: MinoTransform

  // This breaks tests if it's not lazily generated
  private _tilings?: MinoTilings
  get tilings() {
    if (!this._tilings) {
      this._tilings = new MinoTilings(this)
    }
    return this._tilings
  }

  // Constructors
  // ============

  // Private constructor -- we want to make sure any mino we create is cached
  private constructor(data: MinoData) {
    this.data = data
    this.dataSet = new Set(data)
    this.order = data.length
    this.rawDims = getDims(data)
    this.classes = new MinoClasses(this)
    this.transform = new MinoTransform(this)
  }

  get width() {
    return px(this.rawDims)
  }
  get height() {
    return py(this.rawDims)
  }
  get dims() {
    return [this.width, this.height]
  }

  static fromData(data: MinoData) {
    const key = getKey(data)
    if (!cache[key]) {
      cache[key] = new Polyomino(data)
    }
    return cache[key]
  }

  static fromString(str: string) {
    return Polyomino.fromData(fromString(str))
  }

  static of(mino: MinoLike) {
    if (mino instanceof Polyomino) {
      return mino
    }
    if (typeof mino === "string") {
      return Polyomino.fromString(mino)
    }
    throw new Error("no minolike determined")
  }

  // Static methods
  // ==============

  /** Sort the minos in a canonical order */
  static sort(minos: Polyomino[]): Polyomino[] {
    return minos.toSorted((a, b) => a.cmp(b))
  }

  // Properties
  // ==========

  cmp(other: Polyomino) {
    if (this.height !== other.height) {
      return other.height - this.height
    }
    if (this.width !== other.width) {
      return other.width - this.width
    }
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const p = encode(x, y)
        if (this.hasRaw(p) !== other.hasRaw(p)) {
          return +other.hasRaw(p) - +this.hasRaw(p)
        }
      }
    }
    return 0
  }

  /** Return whether the two polyominoes represent the same fixed mino */
  equals(other: Polyomino) {
    // Just do identity equality since everything is cached
    return this === other
  }

  /** Return the coordinate of the mino's squares */
  coords() {
    return this.data.values().map((v) => Vector.fromPacked(v))
  }

  hasRaw(point: PackedPoint) {
    return this.dataSet.has(point)
  }

  has(x: number, y: number) {
    return this.hasRaw(encode(x, y))
  }

  /** Return the edge list for this mino */
  boundary() {
    return getEdges(this.data)
  }

  *innerBoundaries() {
    yield* this.punctures().map(getEdgesInner)
  }

  // TODO (perf) this is probably inefficient since we're using vectors instead of packed points
  *getHolesOrPunctures(nbrFn: (coord: PackedPoint) => Generator<PackedPoint>) {
    const visited = new Set()
    const nbrs = [...this.innerRawNeighbors()]
    while (nbrs.length > 0) {
      let current
      do {
        current = nbrs.pop()
      } while (visited.has(current))
      const stack = [current]
      let isHole = true
      const currentHole = []
      while (stack.length > 0) {
        const current = stack.pop()!
        const x = px(current)
        const y = py(current)
        if (x <= 0 || y <= 0 || x >= this.width - 1 || y >= this.height - 1) {
          // If we reach the edge of the mino, break
          isHole = false
        }
        if (visited.has(current)) {
          continue
        }
        if (this.hasRaw(current)) {
          continue
        }
        currentHole.push(current)
        visited.add(current)
        stack.push(
          ...nbrFn(current).filter(
            (n2) =>
              !this.hasRaw(n2) &&
              px(n2) >= 0 &&
              py(n2) >= 0 &&
              px(n2) <= this.width - 1 &&
              py(n2) <= this.height - 1,
          ),
        )
      }
      if (isHole) {
        yield currentHole
      }
    }
  }

  // Return the punctures in this polyomino, as sets of coordinates
  *punctures() {
    if (this.order < 8) return
    yield* this.getHolesOrPunctures(kingwiseNeighbors)
  }

  hasPuncture() {
    return !!this.punctures().next().value
  }

  // Return the holes in this polyomino, as sets of coordinates
  *holes() {
    if (this.order < 7) return
    yield* this.getHolesOrPunctures(neighbors)
  }

  hasHole() {
    return !!this.holes().next().value
  }

  /** Return the perimeter of this polyomino */
  perimeter() {
    return (
      this.boundary().length +
      sum(
        this.innerBoundaries()
          .map((bound) => bound.length)
          .toArray(),
      )
    )
  }

  /**
   * Return whether the polyomino is "balanced".
   * That is, when doing a checkerboard coloring of the mino,
   * there are an equal number of white and black squares
   * (or for odd order polyominoes, if the difference is minimized).
   */
  isBalanced() {
    const [white, black] = partition(
      this.data,
      (c) => (px(c) + py(c)) % 2 === 0,
    )
    if (this.order % 2 === 0) {
      return white.length === black.length
    } else {
      return Math.abs(white.length - black.length) === 1
    }
  }

  // Relatives
  // =========

  /** Iterate over all points of this mino along with the possible parent associated with it. */
  possibleParents() {
    return [...this.data].map((coord) => {
      const parent = removeSquare(this.data, coord)
      return {
        mino: isValid(parent) ? Polyomino.fromData(parent) : undefined,
        coord,
      }
    })
  }

  enumerateParents() {
    return this.possibleParents().filter((link) => link.mino) as RelativeLink[]
  }

  parents() {
    return this.enumerateParents().map((link) => link.mino)
  }

  /** Return the set of all free parents of this mino */
  freeParents() {
    return new Set(this.parents().map((p) => p.transform.free()))
  }

  /** Generator of inner neighbors of the polyomino as PackedPoints */
  *innerRawNeighbors(): Generator<PackedPoint> {
    const visited = new Set<PackedPoint>()
    for (const p of this.data) {
      for (const dir of directions) {
        const p1 = move(p, dir)
        if (
          p1 != null &&
          !visited.has(p1) &&
          !this.hasRaw(p1) &&
          px(p1) < this.width &&
          py(p1) < this.height
        ) {
          yield p1
          visited.add(p1)
        }
      }
    }
  }

  private *iterNeighbors(): Generator<PackedPoint> {
    const visited = new Set()
    for (const coord of this.data) {
      for (const nbr of neighbors(coord)) {
        if (!this.hasRaw(nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          yield nbr
        }
      }
    }
  }

  neighbors() {
    return [...this.iterNeighbors()]
  }

  enumerateChildren() {
    return this.neighbors().map((coord) => {
      const mino = Polyomino.fromData(addSquare(this.data, coord))
      return {
        mino,
        coord,
      }
    })
  }

  /** Return the list of all children of this mino */
  children() {
    return this.neighbors().map((coord) => {
      return Polyomino.fromData(addSquare(this.data, coord))
    })
  }

  /** Return the set of all free parents of this mino */
  freeChildren() {
    return new Set(this.children().map((c) => c.transform.free()))
  }

  /**
   * Get the longest straight line mino contained in this one,
   * and the number of times it occurs.
   */
  longestLine() {
    let max = 0
    let maxCount = 0
    for (const point of this.data) {
      for (const dir of ["right", "down"] as const) {
        const opposite = move(point, flip(dir))
        if (opposite === undefined || !this.hasRaw(opposite)) {
          const newMax = this.getLineLength(point, dir)
          if (newMax > max) {
            max = newMax
            maxCount = 1
          } else {
            maxCount++
          }
        }
      }
    }
    return { max, maxCount }
  }

  /**
   * Get the longest wave/zigzag mino contained in this one,
   * and the number of times it occurs.
   */
  longestWave() {
    let max = 0
    let maxCount = 0
    for (const point of this.data) {
      for (const [dir1, dir2] of [
        ["down", "right"],
        ["right", "down"],
        ["down", "left"],
        ["left", "down"],
      ] as const) {
        const opposite = move(point, flip(dir2))
        if (opposite === undefined || !this.hasRaw(opposite)) {
          const newMax = this.getWaveLength(point, dir1, dir2)
          if (newMax > max) {
            max = newMax
            maxCount = 1
          } else {
            maxCount++
          }
        }
      }
    }
    return { max, maxCount }
  }

  private getLineLength(point: PackedPoint, dir: Direction) {
    let count = 0
    let p: PackedPoint | undefined = point
    while (p !== undefined && this.hasRaw(p)) {
      count++
      p = move(p, dir)
    }
    return count
  }

  private getWaveLength(point: PackedPoint, dir1: Direction, dir2: Direction) {
    let count = 0
    let p: PackedPoint | undefined = point
    while (p !== undefined && this.hasRaw(p)) {
      p = move(p, count % 2 === 0 ? dir1 : dir2)
      count++
    }
    return count
  }

  // Formatting
  // ==========

  /** Print the delimited source string of the mino */
  toString() {
    return display(this.data)
  }

  /** Pretty-printed representation of the mino */
  display() {
    return display(this.data, "[]", "  ", "\n") + "\n"
  }
}

const orderPrefixes = [
  "",
  "mono",
  "do",
  "tro",
  "tetro",
  "pento",
  "hexo",
  "hepto",
  "octo",
  "nono",
  "deco",
  "undeco",
  "dodeco",
]

export function orderName(order: number, plural = false) {
  return `${orderPrefixes[order]}mino${plural ? "es" : ""}`
}
