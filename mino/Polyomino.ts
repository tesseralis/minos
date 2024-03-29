import { partition, sortBy, once } from "lodash"
import { VectorLike } from "lib/vector"
import {
  MinoData,
  Dims,
  getOrder,
  getWidth,
  getHeight,
  contains,
  getCoords,
  fromCoords,
  displayMino,
  fromString,
  toString,
} from "./data"
import { getEdges } from "./outline"
// Import relative to the index to avoid circular dependency
import {
  MinoTransform,
  MinoRelatives,
  MinoClasses,
  MinoTilings,
} from "./internal"

// cache of all created minos
const cache: Record<MinoData, Polyomino> = {}

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
  relatives: MinoRelatives
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
    this.order = getOrder(data)
    this.width = getHeight(data)
    this.height = getWidth(data)
    this.dims = [this.width, this.height]
    this.classes = new MinoClasses(this)
    this.relatives = new MinoRelatives(this)
    this.transform = new MinoTransform(this)
  }

  static fromData(data: MinoData) {
    if (!cache[data]) {
      cache[data] = new Polyomino(data)
    }
    return cache[data]
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
  coords = once(() => [...getCoords(this.data)])

  /** Return whether this mino contains the coordinate */
  contains(coord: VectorLike) {
    return contains(this.data, coord)
  }

  /** Return the edge list for this mino */
  boundary = once(() => getEdges(this.coords()))

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

  // Formatting
  // ==========

  /** Print the delimited source string of the mino */
  toString() {
    return toString(this.data)
  }

  /** Pretty-printed representation of the mino */
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
