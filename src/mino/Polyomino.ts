import { sortBy, once, range } from "lodash-es"
import PointSet from "PointSet"
import Vector, { VectorLike } from "vector"
import {
  MinoData,
  Dims,
  Coord,
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
import { getOutline } from "./outline"
import { getNeighbors, isValid, addSquare, removeSquare } from "./relatives"
import {
  Transform,
  transforms,
  reflections,
  transformMinoCoord,
  getSymmetry,
} from "./transform"

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Coord
}
export type RelativeLink = Required<PossibleRelativeLink>

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

  private _free?: Polyomino

  // Constructors
  // ============

  // Private constructor -- we want to make sure any mino we create is cached
  private constructor(data: MinoData) {
    this.data = data
    this.order = getOrder(data)
    this.width = getHeight(data)
    this.height = getWidth(data)
    this.dims = [this.width, this.height]
  }

  private static fromData(data: MinoData) {
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
      (mino) => -mino.width,
      (mino) => -mino.height,
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

  // Relationships
  // =============

  contains(coord: Coord) {
    return contains(this.data, coord)
  }

  /** Iterate over all points of this mino along with the possible parent associated with it. */
  possibleParents = once(() =>
    this.coords().map((coord) => {
      const parent = removeSquare(this.data, coord)
      return {
        mino: isValid(parent) ? Polyomino.fromData(parent) : null,
        coord,
      }
    }),
  )

  enumerateParents = once(
    () => this.possibleParents().filter((link) => link.mino) as RelativeLink[],
  )

  parents = once(() => this.enumerateParents().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeParents = once(() => new Set(this.parents().map((p) => p.free())))

  private *neighbors(): Generator<Coord> {
    const visited = new PointSet()
    for (const coord of this.coords()) {
      for (const nbr of getNeighbors(coord)) {
        if (!contains(this.data, nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          yield nbr
        }
      }
    }
  }

  enumerateChildren = once(() =>
    [...this.neighbors()].map((coord) => ({
      mino: Polyomino.fromData(addSquare(this.data, coord)),
      coord,
    })),
  )

  /** Return the list of all children of this mino */
  children = once(() => this.enumerateChildren().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeChildren = once(() => new Set(this.children().map((c) => c.free())))

  // Transforms and symmetry
  // =======================

  /** Transform this mino with the given transformation */
  transform(trans: Transform) {
    return Polyomino.fromCoords(
      this.coords().map((p) => transformMinoCoord(p, this.dims, trans)),
    )
  }

  /** Return the list of all transforms of this mino */
  // TODO make this unique
  transforms = once(() => transforms.map((t) => this.transform(t)))

  /** true if this mino is symmetric wrt the given transform */
  hasSymmetry(t: Transform) {
    return this.equals(this.transform(t))
  }

  /** true if the mino is the same as its reflection */
  isOneSided = once(() => !reflections.some((t) => this.hasSymmetry(t)))

  /** Get the symmetry of this mino */
  symmetry = once(() => getSymmetry((axis) => this.hasSymmetry(axis)))

  /** Get the free polyomino corresponding to this mino */
  free() {
    if (!this._free) {
      const transforms = this.transforms()
      const free = Polyomino.sort(transforms)[0]
      // populate the free polyomino for all the transforms
      for (const trans of transforms) {
        trans._free = free
      }
    }
    // this._free should now be defined
    return this._free!
  }

  /** Returns true if the two minos are equivalent under transformations */
  equivalent(other: Polyomino) {
    return this.free().equals(other.free())
  }

  // Miscellaneous
  // =============

  /** Return the outline of this mino */
  outline = once(() => [...getOutline(this.coords())])

  /** Return whether the polyomino contains a hole */
  hasHole() {
    // First mino with a hole is a heptomino
    if (this.order < 7) {
      return false
    }
    for (const x of range(1, this.width - 1)) {
      for (const y of range(1, this.height - 1)) {
        // Has a hole if there is a point inside the mino that isn't contained in the mino
        // but its neighbors are all in the mino.
        // Note: this only works for order <= 8
        const p = new Vector(x, y)
        if (this.contains(p)) {
          break
        }
        const nbrs = [...getNeighbors(p)]
        if (nbrs.every((nbr) => this.contains(nbr))) {
          return true
        }
      }
    }
    return false
  }

  /** Print the delimited source string of the mino */
  toString() {
    return toString(this.data)
  }

  /** Pretty-printed representation of the mino */
  display() {
    return displayMino(this.data)
  }
}
