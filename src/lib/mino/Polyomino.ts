import { partition, sortBy, once } from "lodash-es"
import { type VectorLike } from "$lib/vector"
import {
  type MinoData,
  type Dims,
  getOrder,
  getHeight,
  contains,
  getCoords,
  fromCoords,
  // displayMino,
  fromString,
  toString,
  type Coord,
  type MinoKey,
  getKey,
  create,
  displayMino,
} from "./dataArray"
import {
  removeSquare,
  isValid,
  type RelativeLink,
  getNeighbors,
  addSquare,
} from "./relativesArray"
import { getEdges } from "./outline"
// Import relative to the index to avoid circular dependency
import { MinoTransform, MinoClasses, MinoTilings, O_OCTOMINO } from "./internal"
import PointSet from "$lib/PointSet"

// cache of all created minos
const cache: Record<MinoKey, Polyomino> = {}

// type of stuff that can be cast into a Polyomino
export type MinoLike = string | VectorLike[] | Polyomino

export default class Polyomino {
  data: MinoData
  key: string
  /** The number of squares in this polyomino */
  order: number

  /** Polyomino dimensions */
  width: number
  height: number
  dims: Dims

  // classes: MinoClasses
  transform: MinoTransform

  // This breaks tests if it's not lazily generated
  // private _tilings?: MinoTilings
  // get tilings() {
  //   if (!this._tilings) {
  //     this._tilings = new MinoTilings(this)
  //   }
  //   return this._tilings
  // }

  // Constructors
  // ============

  // Private constructor -- we want to make sure any mino we create is cached
  private constructor(data: MinoData) {
    this.data = data
    this.key = getKey(data)
    // this.key = ""
    this.order = getOrder(data)
    this.width = getHeight(data)
    this.height = data.width
    this.dims = [this.width, this.height]
    // this.classes = new MinoClasses(this)
    this.transform = new MinoTransform(this)
  }

  static fromData(data: MinoData) {
    const key = getKey(data)
    if (!cache[key]) {
      cache[key] = new Polyomino(data)
    }
    return cache[key]
    // return new Polyomino(data)
  }

  /**
   * Return the mino represented by the given coordinates
   */
  static fromCoords(coords: VectorLike[]) {
    return Polyomino.fromData(fromCoords(coords))
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
    return sortBy(minos, [
      (mino) => -mino.height,
      (mino) => -mino.width,
      (mino) => mino.key,
    ])
  }

  // Properties
  // ==========

  /** Return whether the two polyominoes represent the same fixed mino */
  equals(other: Polyomino) {
    return this.key === other.key
  }

  /** Return the coordinate of the mino's squares */
  coords = once(() => [...getCoords(this.data)])

  /** Return whether this mino contains the coordinate */
  contains(coord: VectorLike) {
    return contains(this.data, coord)
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

  enumerateChildren = once(() =>
    this.neighbors().map((coord) => ({
      mino: Polyomino.fromData(addSquare(this.data, coord)),
      coord,
    })),
  )

  /** Return the list of all children of this mino */
  children = once(() => this.enumerateChildren().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeChildren = () => new Set(this.children().map((c) => c.transform.free()))

  // Formatting
  // ==========

  /** Print the delimited source string of the mino */
  toString() {
    return toString(this.data)
  }

  // /** Pretty-printed representation of the mino */
  display() {
    return displayMino(this.data)
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
