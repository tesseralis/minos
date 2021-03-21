import { range, zip } from "lodash-es"
import Vector from "vector"
import { Coord } from "./data"

// Directions
// ==========

export type Direction = "left" | "right" | "up" | "down"
export type Edge = { dir: Direction; start: Coord }

function flip(d: Direction) {
  switch (d) {
    case "up":
      return "down"
    case "down":
      return "up"
    case "left":
      return "right"
    case "right":
      return "left"
  }
}

/** Move a point in the given direction */
export function move(p: Coord, dir: Direction): Coord {
  switch (dir) {
    case "left":
      return p.add(Vector.LEFT)
    case "right":
      return p.add(Vector.RIGHT)
    case "down":
      return p.add(Vector.DOWN)
    case "up":
      return p.add(Vector.UP)
  }
}

// Generic array functions
// =======================
// TODO move out to a utility if we need these elsewhere

function* cycle<T>(list: T[], limit: number = list.length): Generator<T[]> {
  for (const i of range(limit)) {
    yield list.slice(i).concat(list.slice(0, i))
  }
}

// Split the array at the given index breakpoints
function splitAt<T>(array: T[], indices: number | number[]): T[][] {
  const idxs = typeof indices === "number" ? [indices] : indices
  const result: T[][] = []
  let start = 0
  for (const index of idxs) {
    result.push(array.slice(start, index))
    start = index
  }
  result.push(array.slice(start))
  return result
}

// EdgeList class
// ==============

/**
 * A class representing a list of edges, with functions to manipulate them.
 */
export class EdgeList {
  data: Edge[]
  length: number

  constructor(data: Edge[]) {
    this.data = data
    this.length = data.length
  }

  /** Get the starting coordinate for this EdgeList */
  start(): Coord {
    return this.data[0].start
  }

  /** Get the ending coordinate of this EdgeList */
  end(): Coord {
    const edge = this.data[this.length - 1]
    return move(edge.start, edge.dir)
  }

  /**
   * Return whether the two EdgeLists are inverses of each other.
   * That is, if they represent the same edges with the directions flipped.
   */
  isInverse(segment: EdgeList): boolean {
    const otherInv = [...segment.data].reverse()
    const pairs = zip(this.data, otherInv)
    return pairs.every(([e1, e2]) => flip(e1!.dir) === e2!.dir)
  }

  /**
   * Return whether the edgelist is a palindrome,
   * and thus has 180deg rotational symmetry.
   */
  isPalindrome(): boolean {
    if (this.length === 0) {
      return true
    }
    return range(Math.floor(this.length / 2)).every(
      (i) => this.data[i].dir === this.data[this.length - 1 - i].dir,
    )
  }

  // Array util wrappers

  /** Iterate over copies of this EdgeList with different edges as the starting segment. */
  *cycle(limit: number = this.length): Generator<EdgeList> {
    for (const rotation of cycle(this.data, limit)) {
      yield new EdgeList(rotation)
    }
  }

  /** Split this edge list over the given indices. */
  splitAt(indices: number | number[]): EdgeList[] {
    return splitAt(this.data, indices).map((es) => new EdgeList(es))
  }
}
