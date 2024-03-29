import { once } from "lodash"
import { Polyomino } from "./internal"
import Vector, { VectorLike } from "lib/vector"
import PointSet from "lib/PointSet"
import {
  MinoData,
  Coord,
  MAX_WIDTH,
  fromBits,
  contains,
  getCoords,
  getData,
  getWidth,
  rowBits,
  getCoordMask,
  getColumnMask,
} from "./data"

export interface PossibleRelativeLink {
  mino?: Polyomino
  coord: Coord
}

export type RelativeLink = Required<PossibleRelativeLink>

/**
 * Methods for obtaining the parents and children of a polyomino.
 */
export default class MinoRelatives {
  private mino: Polyomino

  constructor(mino: Polyomino) {
    this.mino = mino
  }

  /** Iterate over all points of this mino along with the possible parent associated with it. */
  possibleParents = once(() =>
    this.mino.coords().map((coord) => {
      const parent = removeSquare(this.mino.data, coord)
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
  freeParents = once(
    () => new Set(this.parents().map((p) => p.transform.free())),
  )

  private *iterNeighbors(): Generator<Coord> {
    const visited = new PointSet()
    for (const coord of this.mino.coords()) {
      for (const nbr of getNeighbors(coord)) {
        if (!this.mino.contains(nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          yield nbr
        }
      }
    }
  }

  neighbors = once(() => [...this.iterNeighbors()])

  enumerateChildren = once(() =>
    this.neighbors().map((coord) => ({
      mino: Polyomino.fromData(addSquare(this.mino.data, coord)),
      coord,
    })),
  )

  /** Return the list of all children of this mino */
  children = once(() => this.enumerateChildren().map((link) => link.mino))

  /** Return the set of all free parents of this mino */
  freeChildren = once(
    () => new Set(this.children().map((c) => c.transform.free())),
  )
}

/**
 * Return the mino with the width adjusted by delta (e.g. +1 or -1)
 */
function adjustWidth(mino: MinoData, delta: number): MinoData {
  const w = getWidth(mino) + delta
  if (w >= MAX_WIDTH) throw new Error("Already at maximum width")
  if (w < 1) throw new Error("Already at minimum width")
  let result = 0
  let i = 0

  for (const row of rowBits(mino)) {
    result |= row << (i * w)
    i++
  }
  return fromBits(result, w)
}

function incWidth(mino: MinoData): MinoData {
  return adjustWidth(mino, +1)
}

function decWidth(mino: MinoData): MinoData {
  return adjustWidth(mino, -1)
}

function shiftLeft(mino: MinoData): MinoData {
  const expanded = incWidth(mino)
  const data = getData(expanded)

  return fromBits(data << 1, getWidth(expanded))
}

function shiftRight(mino: MinoData): MinoData {
  const decremented = decWidth(mino)
  const data = getData(decremented)

  return fromBits(data >> 1, getWidth(decremented))
}

function shiftDown(mino: MinoData): MinoData {
  const w = getWidth(mino)
  return fromBits(getData(mino) >> w, w)
}

function shiftUp(mino: MinoData): MinoData {
  const w = getWidth(mino)
  return fromBits(getData(mino) << w, w)
}

function doAdd(mino: MinoData, i: number, j: number): MinoData {
  return mino | getCoordMask(i, j, getWidth(mino))
}

/**
 * Append the square at [i,j] to the mino
 */
export function addSquare(mino: MinoData, [x, y]: VectorLike): MinoData {
  if (x < 0) {
    return doAdd(shiftUp(mino), 0, y)
  }
  if (y < 0) {
    return doAdd(shiftLeft(mino), x, 0)
  }
  if (y === getWidth(mino)) {
    return doAdd(incWidth(mino), x, y)
  }
  return doAdd(mino, x, y)
}

function bottomRowEmpty(mino: MinoData): boolean {
  const row = [...rowBits(mino)][0]
  return !row
}

function rightColumnEmpty(mino: MinoData): boolean {
  return !getColumnMask(mino, 0)
}

function leftColumnEmpty(mino: MinoData): boolean {
  return !getColumnMask(mino, getWidth(mino) - 1)
}

function doRemove(mino: MinoData, i: number, j: number): MinoData {
  return mino & ~getCoordMask(i, j, getWidth(mino))
}

/**
 * Remove the square at coordinate [i, j] from the Mino
 */
export function removeSquare(mino: MinoData, [x, y]: VectorLike): MinoData {
  const removed = doRemove(mino, x, y)
  if (bottomRowEmpty(removed)) {
    return shiftDown(removed)
  } else if (rightColumnEmpty(removed)) {
    return shiftRight(removed)
  } else if (leftColumnEmpty(removed)) {
    return decWidth(removed)
  }
  return removed
}

/**
 * Return the neighbors of the coord [i,j]
 */
export function* getNeighbors(p: Coord): Generator<Coord> {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield p.add(Vector.DOWN)
  yield p.add(Vector.UP)
  yield p.add(Vector.RIGHT)
  yield p.add(Vector.LEFT)
}

export function* getKingwiseNeighbors(p: Coord): Generator<Coord> {
  yield* getNeighbors(p)
  yield p.add([1, 1])
  yield p.add([1, -1])
  yield p.add([-1, -1])
  yield p.add([-1, 1])
}

export function isValid(mino: MinoData): boolean {
  const p0 = [...getCoords(mino)][0]
  // the null-omino is not a valid polyomino
  if (!p0) return false
  const queue = [p0]
  const width = getWidth(mino)

  // Initialize the visited bitmask
  // Include the mino's width so that we can easily compare later
  let visited = width

  while (queue.length) {
    const p = queue.pop()!
    const mask = getCoordMask(p.x, p.y, width)
    if (visited & mask) continue
    visited |= mask

    for (const nbr of getNeighbors(p)) {
      if (!contains(mino, nbr)) continue
      queue.push(nbr)
    }
  }
  // True if we have visited all the squares in the mino
  return visited === mino
}
