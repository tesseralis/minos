import { sortBy } from "lodash-es"
import {
  Mino,
  Coord,
  getSize,
  getWidth,
  getHeight,
  getShape,
  getNeighbors,
  getCoords,
  fromCoords,
  isValid,
  displayMino,
} from "./mino"
import { getOutline } from "./draw"
import { addSquare, removeSquare } from "./modify"
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

function lazy<T>(fn: () => T) {
  let cachedVal: T | null = null
  return () => {
    if (!cachedVal) {
      cachedVal = fn()
    }
    return cachedVal
  }
}

// cache of all created minos so far
const cache: Record<Mino, Polyomino> = {}

export default class Polyomino {
  data: Mino
  /** The number of squares in this polyomino */
  order: number

  // Construtors

  // Private constructor -- we want to make sure any mino we create is cached
  private constructor(data: Mino) {
    this.data = data
    this.order = getSize(data)
  }

  static fromData(data: Mino) {
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

  // Static methods

  /** Sort the minos in a canonical order */
  static sort(minos: Polyomino[]): Polyomino[] {
    return sortBy(minos, [
      (mino) => -getHeight(mino.data),
      (mino) => -getWidth(mino.data),
      (mino) => mino.data,
    ])
  }

  // Properties

  // FIXME rename these functions
  width = lazy(() => getHeight(this.data))
  // width = getHeight(this.data)
  height = lazy(() => getWidth(this.data))

  /** Return whether the two polyominoes represent the same fixed mino */
  equals(other: Polyomino) {
    return this.data === other.data
  }

  /** Return the coordinate of the mino's squares */
  coords = lazy(() => [...getCoords(this.data)])

  // Relationships

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

  enumerateChildren = lazy(() =>
    [...getNeighbors(this.data)].map((coord) => ({
      mino: Polyomino.fromData(addSquare(this.data, coord)),
      coord,
    })),
  )

  children = lazy(() => this.enumerateChildren().map((link) => link.mino))

  // Transforms and symmetry

  /** Transform this mino with the given transformation */
  transform(trans: Transform) {
    return Polyomino.fromCoords(
      this.coords().map((p) => transformCoord(p, getShape(this.data), trans)),
    )
  }

  /** Return the list of all transforms of this mino */
  transforms = lazy(() => transforms.map((t) => this.transform(t)))

  /** true if this mino is symmetric wrt the given transform */
  hasSymmetry(t: Transform) {
    return this.equals(this.transform(t))
  }

  /** true if the mino is the same as its reflection */
  isOneSided = lazy(() => !reflections.some((t) => this.hasSymmetry(t)))

  /** Get the symmetry of this mino */
  symmetry = lazy(() => getSymmetry(this.data))

  /** Get the free polyomino corresponding to this mino */
  free = lazy(() => Polyomino.sort(this.transforms())[0])

  /** Returns true if the two minos are equivalent under transformations */
  equivalent(other: Polyomino) {
    return this.free() === other.free()
  }

  // Miscellaneous

  /** Return the outline of this mino */
  outline = lazy(() => getOutline(this.coords()))

  display() {
    return displayMino(this.data)
  }
}
