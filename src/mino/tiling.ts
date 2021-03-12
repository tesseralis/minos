import { range, zip, maxBy } from "lodash-es"
import Vector from "vector"
import Polyomino from "./Polyomino"
import { Coord } from "./data"
import {
  EdgeList,
  isInverse,
  getEdges,
  segmentStart,
  segmentEnd,
} from "./outline"

// FIXME dedupe from pattern.ts
interface MinoPlacement {
  mino: Polyomino
  coord: Coord
}

type Basis = [u: Coord, v: Coord]

/**
 * Represents a polyomino tiling that can be tesselated by repeating a pattern
 * through translation.
 */
interface Tiling {
  /** The set of polyominoes that make up the fundamental domain for the tiling */
  domain: MinoPlacement[]

  /** Two vectors that determine how far to translate each repetition of the pattern */
  basis: Basis
}

// Generic array functions
// FIXME move out to a utility

function* cycle<T>(list: T[], limit: number = list.length): Generator<T[]> {
  for (const i of range(limit)) {
    yield list.slice(i).concat(list.slice(0, i))
  }
}

function splitAt<T>(list: T[], index: number): [front: T[], back: T[]] {
  return [list.slice(0, index), list.slice(index)]
}

// Split the array at the given index breakpoints
function splitAtIndices<T>(array: T[], indices: number[]): T[][] {
  const result: T[][] = []
  let start = 0
  for (const index of indices) {
    result.push(array.slice(start, index))
    start = index
  }
  result.push(array.slice(start))
  return result
}

/**
 * Return the distance vector between the two edges.
 */
function getTransDistance([startList, endList]: SegmentPair): Coord {
  return segmentStart(startList).sub(segmentEnd(endList))
}

// Translation Criterion:
// The polyomino can be split into six segments ABCDEF such that AD, BE, CF are translations

type SegmentPair = [EdgeList, EdgeList]
// A list of pairs, each consisting of an opposite pair of edges
type TransSegments = SegmentPair[]

// Get the breakpoints to partition an array of length n
// into two or three elements
function* getPartitionIndices(n: number): Generator<number[]> {
  for (const i of range(1, n)) {
    yield [i]
  }
  for (const i of range(1, n - 1)) {
    for (const j of range(i + 1, n)) {
      yield [i, j]
    }
  }
}

/**
 * Return the segments of the translation criterion for the given EdgeList,
 * or undefined if the edges do not satisfy the translation criterion.
 */
function getTransSegments(edges: EdgeList): TransSegments | undefined {
  // for each possible starting point
  const half = Math.floor(edges.length / 2)
  for (const rotation of cycle(edges, half)) {
    // split into two parts
    const [front, back] = splitAt(rotation, half)

    // for each partition of at least two pieces, check that each pair are opposites
    for (const partitionIndices of getPartitionIndices(half)) {
      const frontPart = splitAtIndices(front, partitionIndices)
      const backPart = splitAtIndices(back, partitionIndices)
      const pairs = zip(frontPart, backPart)
      if (pairs.every(([a, b]) => isInverse(a!, b!))) {
        return pairs as TransSegments
      }
    }
  }

  // If no partition or rotation matches, this doesn't satisfy the criterion
  return undefined
}

// Get the basis for the translation criterion segments
function getTransBasis(segments: TransSegments): Basis {
  const u = getTransDistance(segments[0])
  const v = getTransDistance(segments[1])
  // FIXME pick two out of the three based on a criterion,
  // such as vector length or segment length
  return [u, v]
}

// Conway Criterion:
// The polyomino can be split into six segments ABCDEF such that:
// AD are translations, and BCEF are each symmetric with respect to 180deg rotation.

/**
 * Tests if the edge list is a palindrome,
 * meaning it is symmetric with respect to 180 degree rotation.
 */
function isPalindrome(edges: EdgeList): boolean {
  return range(Math.floor(edges.length / 2)).every(
    (i) => edges[i].dir === edges[edges.length - 1 - i].dir,
  )
}

// Split edges into two edge lists, each of which is a palindrome
// or return undefined if impossible
function getPalindromePairs(edges: EdgeList): [EdgeList, EdgeList] | undefined {
  for (const i of range(1, edges.length)) {
    const [front, back] = splitAt(edges, i)
    if (isPalindrome(front) && isPalindrome(back)) {
      return [front, back]
    }
  }
  return undefined
}

type ConwaySegments = [
  a: EdgeList,
  b: EdgeList,
  c: EdgeList,
  d: EdgeList,
  e: EdgeList,
  f: EdgeList,
]

/**
 * Return the segments of the Conway criterion for the given EdgeList,
 * or undefined if the edges do not satisfy the Conway criterion.
 */
function getConwaySegments(edges: EdgeList): ConwaySegments | undefined {
  const half = Math.floor(edges.length / 2)
  // Cycle through all possible permutations
  for (const rotation of cycle(edges)) {
    // TODO handle cases where A and D are both 0
    // For each possible translation pair in the start
    for (const i of range(1, half - 1)) {
      const [a, tail] = splitAt(rotation, i)
      // try to find the inverse of A
      let foundInverse = false
      for (const j of range(0, tail.length - a.length - 1)) {
        if (isInverse(a, tail.slice(j, j + a.length))) {
          foundInverse = true
          const [bc, d, ef] = splitAtIndices(tail, [j, j + a.length])
          // ensure the remaining segments can be split into two palindromic segments
          const bcPal = getPalindromePairs(bc)
          const efPal = getPalindromePairs(ef)
          if (bcPal && efPal) {
            const [b, c] = bcPal
            const [e, f] = efPal
            return [a, b, c, d, e, f]
          }
        }
      }
      // If no translated twin can be found, none can be found for strings of longer length
      // so break and do the next roation in the cycle
      if (!foundInverse) {
        break
      }
    }
  }
  throw new Error("Not implemented")
}

function getBottomRight(coords: Coord[]): Coord {
  const xs = coords.map((u) => u.x)
  const ys = coords.map((u) => u.y)
  return new Vector(Math.max(...xs) + 1, Math.max(...ys) + 1)
}

/**
 * Flip the coordinate over the center of the given palindromic segment.
 */
function flipPoint(coord: Coord, segment: EdgeList): Coord {
  // if A and Z are the start and endpoints of the segment,
  // the center is given by M = (A+Z)/2.
  // If O is our coordinate, then:
  // O' = 2M - O
  //    = A + Z - O
  const segStart = segmentStart(segment)
  const segEnd = segmentEnd(segment)
  return segStart.add(segEnd).sub(coord)
}

/**
 * Return a tiling of the plane by the given polyomino, or undefined if no tiling is possible.
 */
export function getTiling(mino: Polyomino): Tiling | undefined {
  // TODO: handle special paired cases
  const edges = [...getEdges(mino.coords())]

  // If the polyomino satisfies the translation criterion:
  const transSegments = getTransSegments(edges)
  if (transSegments) {
    // the given mino can be translated without appending any translations
    const pattern: MinoPlacement[] = [{ coord: Vector.ZERO, mino }]
    // Get two edge pairs and use them as the basis
    const basis = getTransBasis(transSegments)
    return { domain: pattern, basis }
  }

  // If the polyomino satisfies the Conway criterion:
  const conwaySegments = getConwaySegments(edges)
  if (conwaySegments) {
    const [a, b, c, d, e, f] = conwaySegments
    // Flip the mino over the longest segment and use that as the pattern
    const longestSegment = maxBy([b, c, e, f], (edges) => edges.length)!
    const minoBotRight = getBottomRight(mino.coords())
    const inversePoint = flipPoint(minoBotRight, longestSegment)
    const pattern: MinoPlacement[] = [
      { coord: Vector.ZERO, mino },
      { coord: inversePoint, mino: mino.transform("rotateHalf") },
    ]

    // Use the translated pairs as one axis
    const u = getTransDistance([a, d])
    // Pick a segment on the *other* region than the one the longest segment is in
    const otherSegment = [b, c].includes(longestSegment) ? e : b
    // flip the end of the other segment over
    const endpoint = flipPoint(segmentEnd(otherSegment), longestSegment)
    const v = endpoint.sub(segmentStart(otherSegment))
    return { domain: pattern, basis: [u, v] }
  }

  // For polyominoes of size 8 or less, a tiling mino *must* satisfy one of the two criteria
  // or be one of the special cases. If neither are satisfied, then the polyomino does not
  // tile the plane.
  return undefined
}
