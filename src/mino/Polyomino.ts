import { sortBy, once } from "lodash-es"
import { VectorLike } from "vector"
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
import { getEdges, getOutline } from "./outline"
import { EdgeList } from "./edges"
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

  // Boundary
  // ========

  /** Return the outline of this mino */
  outline = once(() => [...getOutline(this.coords())])

  /** Return the edge list for this mino */
  edges = once(() => EdgeList.of(getEdges(this.coords())))

  boundaryClassWithTransform = once(() => {
    const classes = this.transform
      .all()
      .map((t) => ({ transform: t, class: t.edges().boundaryClass() }))

    // If the mino is convex, make filter out transforms based on locations of anchors
    let filtered = classes
    if (this.classes.isConvex()) {
      switch (this.classes.anchors().length) {
        case 3:
          filtered = classes.filter(
            (cls) => !cls.transform.classes.hasAnchor({ x: "end", y: "end" }),
          )
          break
        case 2:
          if (this.classes.isStaircase()) {
            filtered = classes.filter((cls) =>
              cls.transform.classes.hasAnchor({ x: "start", y: "end" }),
            )
          } else {
            filtered = classes.filter((cls) =>
              cls.transform.classes
                .anchors()
                .every((anchor) => anchor.x === "start"),
            )
          }
          break
        case 1:
          filtered = classes.filter((cls) =>
            cls.transform.classes.hasAnchor({ x: "start", y: "end" }),
          )
          break
        default:
          filtered = classes
      }
    } else if (this.classes.isBarChart()) {
      filtered = classes.filter((cls) =>
        cls.transform.classes
          .directedAnchors()
          .every((anchor) => anchor.x === "start"),
      )
    } else if (this.classes.isDirected()) {
      filtered = classes.filter((cls) =>
        cls.transform.classes.isDirectedAtAnchor({ x: "start", y: "end" }),
      )
    }

    if (this.classes.isSemiConvex()) {
      filtered = filtered.filter((cls) =>
        cls.transform.classes.isConvexAtAxis("column"),
      )
    }
    // Get the right boundary class out of the filtered options
    const boundaryClass = sortBy(filtered, (c) => c.class)[0].class
    // Get the representative mino of the class
    const possibleMinos = filtered
      .filter((f) => f.class === boundaryClass)
      .map((f) => f.transform)
    return {
      class: boundaryClass,
      transform: Polyomino.sort(possibleMinos)[0],
    }
  })

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
