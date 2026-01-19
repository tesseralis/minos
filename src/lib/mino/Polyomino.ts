import { partition, sortBy, once } from "lodash-es"
import Vector, { type VectorLike } from "$lib/vector"
import { type Dims, type Coord } from "./data"
import { type RelativeLink, getNeighbors } from "./relatives"
import { getEdges } from "./outline"
// Import relative to the index to avoid circular dependency
import { MinoTransform, MinoClasses, MinoTilings, O_OCTOMINO } from "./internal"
import PointSet from "$lib/PointSet"
import {
  addAll,
  display,
  getHeight,
  getKey,
  getWidth,
  hasX,
  hasY,
  mask,
  maskVec,
  unmask,
  type MinoData,
} from "$lib/mino/dataSet"

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
    let rows = str.split("_")
    const set = new Set<number>()
    for (let [y, row] of rows.entries()) {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === "1") {
          set.add(mask(x, y))
        }
      }
    }
    return Polyomino.fromData(set)
    // return Polyomino.fromData(fromString(str))
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
    return sortBy(minos, [
      (mino) => -mino.height,
      (mino) => -mino.width,
      (mino) => mino.data,
    ])
  }

  // Properties
  // ==========

  /** Return whether the two polyominoes represent the same fixed mino */
  equals(other: Polyomino) {
    return this.data === other.data
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

  private *iterNeighbors(): Generator<Coord> {
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

function addSquare(mino: MinoData, [x, y]: VectorLike) {
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

function removeSquare(mino: MinoData, [x, y]: VectorLike) {
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
  const p0 = mino.values().next().value!
  // the null-omino is not a valid polyomino
  if (!p0) return false
  const queue = [p0]

  // Initialize the visited bitmask
  // Include the mino's width so that we can easily compare later
  let visited = new PointSet()

  while (queue.length) {
    const p = queue.pop()!
    if (visited.has(unmask(p))) continue
    visited.add(unmask(p))

    for (const nbr of getNeighbors(Vector.fromArray(unmask(p)))) {
      if (!mino.has(maskVec(nbr))) continue
      queue.push(maskVec(nbr))
    }
  }
  // True if we have visited all the squares in the mino
  return visited.size === mino.size
}
