import { partition, sortBy, once } from "lodash-es"
import Vector, { type VectorLike } from "$lib/vector"
import { getEdges } from "./outline"
// Import relative to the index to avoid circular dependency
import { MinoTransform, MinoClasses, MinoTilings, O_OCTOMINO } from "./internal"
import PointSet from "$lib/PointSet"
import {
  addAll,
  display,
  getHeight,
  getKey,
  getNeighbors,
  getWidth,
  maskVec,
  unmask,
  addSquare,
  removeSquare,
  isValid,
  type MinoData,
  type RelativeLink,
  fromString,
} from "./data"
import type { Dims } from "./data"

// cache of all created minos
const cache: Record<string, Polyomino> = {}

// type of stuff that can be cast into a Polyomino
export type MinoLike = string | VectorLike[] | Polyomino

export default class Polyomino {
  data: MinoData
  /** The number of squares in this polyomino */
  order: number

  /** Polyomino dimensions */
  width: number
  height: number
  dims: Dims

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
    this.order = data.size
    this.width = getWidth(data)
    this.height = getHeight(data)
    this.dims = [this.width, this.height]
    this.classes = new MinoClasses(this)
    this.transform = new MinoTransform(this)
  }

  static fromData(data: MinoData) {
    const key = getKey(data)
    if (!cache[key]) {
      cache[key] = new Polyomino(data)
    }
    return cache[key]
  }

  /**
   * Return the mino represented by the given coordinates
   */
  static fromCoords(coords: VectorLike[]) {
    const set = new Set<number>()
    addAll(set, coords)
    return Polyomino.fromData(set)
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
    // Otherwise it's a list of coordinates
    return Polyomino.fromCoords(mino)
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
        if (this.contains([x, y]) !== other.contains([x, y])) {
          return +other.contains([x, y]) - +this.contains([x, y])
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
  coords = once(() => [
    ...this.data.values().map((v) => Vector.fromArray(unmask(v))),
  ])

  /** Return whether this mino contains the coordinate */
  contains(coord: VectorLike) {
    return this.data.has(maskVec(coord))
  }

  /** Return the edge list for this mino */
  boundary = once(() => getEdges(this.coords()))

  /** Return the perimeter of this polyomino */
  perimeter = once(() => {
    const perim = this.boundary().length
    // TODO handle larger minos more generally
    if (this.equals(O_OCTOMINO)) {
      return perim + 4
    }
    return perim
  })

  /**
   * Return whether the polyomino is "balanced".
   * That is, when doing a checkerboard coloring of the mino,
   * there are an equal number of white and black squares
   * (or for odd order polyominoes, if the difference is minimized).
   */
  isBalanced() {
    const [white, black] = partition(
      this.coords(),
      (c) => (c.x + c.y) % 2 === 0,
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
  possibleParents = once(() =>
    this.coords().map((coord) => {
      const parent = removeSquare(this.data, coord)
      return {
        mino: isValid(parent) ? Polyomino.fromData(parent) : undefined,
        coord,
      }
    }),
  )

  enumerateParents = once(
    () => this.possibleParents().filter((link) => link.mino) as RelativeLink[],
  )

  parents = once(() => this.enumerateParents().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeParents = once(
    () => new Set(this.parents().map((p) => p.transform.free())),
  )

  private *iterNeighbors(): Generator<Vector> {
    const visited = new PointSet()
    for (const coord of this.coords()) {
      for (const nbr of getNeighbors(coord)) {
        if (!this.contains(nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          yield nbr
        }
      }
    }
  }

  neighbors = once(() => [...this.iterNeighbors()])

  enumerateChildren = once(() => {
    return this.neighbors().map((coord) => ({
      mino: Polyomino.fromData(addSquare(this.data, coord)),
      coord,
    }))
  })

  /** Return the list of all children of this mino */
  children = once(() => this.enumerateChildren().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeChildren = once(
    () => new Set(this.children().map((c) => c.transform.free())),
  )

  /**
   * Get the longest straight line mino contained in this one,
   * and the number of times it occurs.
   */
  longestLine = once(() => {
    let max = 0
    let maxCount = 0
    for (const point of this.coords()) {
      for (const dir of [Vector.RIGHT, Vector.DOWN]) {
        if (!this.contains(point.sub(dir))) {
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
  })

  /**
   * Get the longest wave/zigzag mino contained in this one,
   * and the number of times it occurs.
   */
  longestWave = once(() => {
    let max = 0
    let maxCount = 0
    for (const point of this.coords()) {
      for (const [dir1, dir2] of [
        [Vector.DOWN, Vector.RIGHT],
        [Vector.DOWN, Vector.LEFT],
        [Vector.RIGHT, Vector.DOWN],
        [Vector.LEFT, Vector.DOWN],
      ]) {
        if (!this.contains(point.sub(dir2))) {
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
  })

  private getLineLength(point: Vector, dir: Vector) {
    let count = 0
    while (
      point.x < this.width &&
      point.y < this.height &&
      this.contains(point)
    ) {
      point = point.add(dir)
      count++
    }
    return count
  }

  private getWaveLength(point: Vector, dir1: Vector, dir2: Vector) {
    let count = 0
    while (
      point.x < this.width &&
      point.y < this.height &&
      this.contains(point)
    ) {
      point = point.add(count % 2 === 0 ? dir1 : dir2)
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
    return display(this.data, ", ", ", ", "\n") + "\n"
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
