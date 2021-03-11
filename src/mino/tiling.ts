import { range, zip, maxBy } from "lodash-es"
import Polyomino from "./Polyomino"
import { Coord } from "./data"
import { Direction, move, getEdgeList } from "./draw"

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
  /**
   * The set of polyominoes that make up the base pattern for the tiling
   */
  pattern: MinoPlacement[]
  /**
   * Two vectors that determine how far to translate each repetition of the pattern
   */
  basis: Basis
}

type Edge = { dir: Direction; start: Coord }
type EdgeList = Edge[]
type DirectionList = Direction[]

type ConwaySegments = [
  a: EdgeList,
  b: EdgeList,
  c: EdgeList,
  d: EdgeList,
  e: EdgeList,
  f: EdgeList,
]

function* cycle<T>(list: T[], limit: number = list.length): Generator<T[]> {
  for (const i of range(limit)) {
    yield list.slice(i).concat(list.slice(0, i))
  }
}

function splitAt<T>(list: T[], index: number): [front: T[], back: T[]] {
  return [list.slice(0, index), list.slice(index)]
}

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

// Partition the array at the given index breakpoints
function partition<T>(array: T[], indices: number[]): T[][] {
  const result: T[][] = []
  let start = 0
  for (const index of indices) {
    result.push(array.slice(start, index))
    start = index
  }
  result.push(array.slice(start))
  return result
}

function getOppositeDir(d: Direction) {
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

function isInverse(a: EdgeList, b: EdgeList): boolean {
  const bInv = [...b].reverse()
  const pairs = zip(a, bInv)
  return pairs.every(([a, b]) => getOppositeDir(a!.dir) === b!.dir)
}

type SegmentPair = [EdgeList, EdgeList]
// A list of pairs, each consisting of an opposite pair of edges
type TransSegments = SegmentPair[]

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
      const frontPart = partition(front, partitionIndices)
      const backPart = partition(back, partitionIndices)
      const pairs = zip(frontPart, backPart)
      if (pairs.every(([a, b]) => isInverse(a!, b!))) {
        return pairs as TransSegments
      }
    }
  }

  // If no partition or rotation matches, this doesn't satisfy the criterion
  return undefined
}

function isPalindrome(edges: EdgeList): boolean {
  return range(Math.floor(edges.length / 2)).every(
    (i) => edges[i].dir === edges[edges.length - 1 - i].dir,
  )
}

// Split edges into two edge lists, each of which is a palindrome
function getPalindromePairs(edges: EdgeList): [EdgeList, EdgeList] | undefined {
  for (const i of range(1, edges.length)) {
    const [front, back] = splitAt(edges, i)
    if (isPalindrome(front) && isPalindrome(back)) {
      return [front, back]
    }
  }
  return undefined
}

/**
 * Return the segments of the Conway criterion for the given EdgeList,
 * or undefined if the edges do not satisfy the Conway criterion.
 */
function getConwaySegments(edges: EdgeList): ConwaySegments | undefined {
  const half = Math.floor(edges.length / 2)
  // Cycle through all possible permutations
  for (const rotation of cycle(edges)) {
    // For each possible translation pair in the start
    // TODO handle cases where A and D are both 0
    for (const i of range(1, half - 1)) {
      const [a, tail] = splitAt(rotation, i)
      // try to find the inverse of A
      let foundInverse = false
      for (const j of range(0, tail.length - a.length - 1)) {
        if (isInverse(a, tail.slice(j, j + a.length))) {
          foundInverse = true
          const [bc, def] = splitAt(tail, j)
          const [d, ef] = splitAt(def, a.length)
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
      // if no translated pair can be found, break and do the next rotation in the cycle
      if (!foundInverse) {
        break
      }
    }
  }
  throw new Error("Not implemented")
}

// Get the end coordinate of the edge
function getEndCoord(edge: Edge): Coord {
  return move(edge.start, edge.dir)
}

// FIXME do I really not have this util somewhere?
function getCoordDistance(start: Coord, end: Coord): Coord {
  return [end[0] - start[0], end[1] - start[1]]
}

/**
 * Return the distance vector between the two edges.
 */
function getTransDistance([startList, endList]: SegmentPair): Coord {
  const startEdge = startList[0]
  const endEdge = endList[endList.length - 1]
  return getCoordDistance(startEdge.start, getEndCoord(endEdge))
}

// Get the basis for the translation criterion segments
function getTransBasis(segments: TransSegments): Basis {
  const u = getTransDistance(segments[0])
  const v = getTransDistance(segments[1])
  // FIXME pick two out of the three based on a criterion,
  // such as vector length or segment length
  return [u, v]
}

function getBottomRight(coords: Coord[]): Coord {
  throw new Error("Not implemented")
}

/**
 * Flip the coordinate over the given segment
 */
function flipPoint(coord: Coord, segment: EdgeList): Coord {
  throw new Error("Not implemented")
}

/**
 * Return a tiling of the plane by the given polyomino, or undefined if no tiling is possible.
 */
export function getTiling(mino: Polyomino): Tiling | undefined {
  // TODO: handle special paired cases

  const edges = getEdgeList(mino.coords())

  // If the polyomino satisfies the translation criterion:
  const transSegments = getTransSegments(edges)
  if (transSegments) {
    // the given mino can be translated without appending any translations
    const pattern: MinoPlacement[] = [{ coord: [0, 0], mino }]
    // Get two edge pairs and use them as the basis
    const basis = getTransBasis(transSegments)
    return { pattern, basis }
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
      { coord: [0, 0], mino },
      { coord: inversePoint, mino: mino.transform("rotateHalf") },
    ]

    // Use the translated pairs as one axis
    const u = getTransDistance([a, d])
    const v = u // FIXME this is something really complicated I can't express easily
    return { pattern, basis: [u, v] }
  }

  return undefined
}
