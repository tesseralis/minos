import { sortBy } from "lodash-es"
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
} from "./data"
import { getOutline } from "./draw"
import { getNeighbors, isValid, addSquare, removeSquare } from "./relatives"
import {
  Transform,
  transforms,
  reflections,
  transformCoord,
  getSymmetry,
} from "./transform"

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Coord
}
export type RelativeLink = Required<PossibleRelativeLink>

// lazily evaluate the property
// TODO cached lazy iterators
function lazy<T>(fn: () => T) {
  let cachedVal: T | null = null
  return () => {
    if (!cachedVal) {
      cachedVal = fn()
    }
    return cachedVal
  }
}

// cache of all created minos
const cache: Record<MinoData, Polyomino> = {}

export default class Polyomino {
  data: MinoData
  /** The number of squares in this polyomino */
  order: number

  /** Polyomino dimensions */
  width: number
  height: number
  dims: Dims

  private _free?: Polyomino

  // Construtors

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
  static fromCoords(coords: Coord[]) {
    return this.fromData(fromCoords(coords))
  }

  static fromString(str: string) {
    return this.fromData(fromString(str))
  }

  // Static methods

  /** Sort the minos in a canonical order */
  static sort(minos: Polyomino[]): Polyomino[] {
    return sortBy(minos, [
      (mino) => -mino.width,
      (mino) => -mino.height,
      (mino) => mino.data,
    ])
  }

  // Properties

  /** Return whether the two polyominoes represent the same fixed mino */
  equals(other: Polyomino) {
    return this.data === other.data
  }

  /** Return the coordinate of the mino's squares */
  coords = lazy(() => [...getCoords(this.data)])

  // Relationships

  contains(coord: Coord) {
    return contains(this.data, coord)
  }

  /** Iterate over all points of this mino along with the possible parent associated with it. */
  possibleParents = lazy(() =>
    this.coords().map((coord) => {
      const parent = removeSquare(this.data, coord)
      return {
        mino: isValid(parent) ? Polyomino.fromData(parent) : null,
        coord,
      }
    }),
  )

  enumerateParents = lazy(
    () => this.possibleParents().filter((link) => link.mino) as RelativeLink[],
  )

  parents = lazy(() => this.enumerateParents().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeParents = lazy(() => new Set(this.parents().map((p) => p.free())))

  private *neighbors(): Generator<Coord> {
    const visited = new Set<string>()
    for (const coord of this.coords()) {
      for (const nbr of getNeighbors(coord)) {
        // TODO hash instead of string
        const nbrString = nbr.toString()
        if (!contains(this.data, nbr) && !visited.has(nbrString)) {
          visited.add(nbrString)
          yield nbr
        }
      }
    }
  }

  enumerateChildren = lazy(() =>
    [...this.neighbors()].map((coord) => ({
      mino: Polyomino.fromData(addSquare(this.data, coord)),
      coord,
    })),
  )

  /** Return the list of all children of this mino */
  children = lazy(() => this.enumerateChildren().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeChildren = lazy(() => new Set(this.children().map((c) => c.free())))

  // Transforms and symmetry

  /** Transform this mino with the given transformation */
  transform(trans: Transform) {
    return Polyomino.fromCoords(
      this.coords().map((p) => transformCoord(p, this.dims, trans)),
    )
  }

  /** Return the list of all transforms of this mino */
  // TODO make this unique
  transforms = lazy(() => transforms.map((t) => this.transform(t)))

  /** true if this mino is symmetric wrt the given transform */
  hasSymmetry(t: Transform) {
    return this.equals(this.transform(t))
  }

  /** true if the mino is the same as its reflection */
  isOneSided = lazy(() => !reflections.some((t) => this.hasSymmetry(t)))

  /** Get the symmetry of this mino */
  symmetry = lazy(() => getSymmetry((axis) => this.hasSymmetry(axis)))

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

  /** Return the outline of this mino */
  outline = lazy(() => getOutline(this.coords()))

  /** Pretty-printed representation of the mino */
  display() {
    return displayMino(this.data)
  }
}
