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
import { Transform, getAnchor, transforms } from "./transform"
import {
  MinoPlacement,
  MinoPattern,
  toCoords,
  transformPattern,
  shiftPattern,
} from "./pattern"

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

type TilingPair = [mino: string, transform: Transform, coord: [number, number]]

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

function getPatternEdges(pattern: MinoPattern): EdgeList {
  const coords = [...toCoords(pattern)]
  return [...getEdges(coords)]
}

function getPairsMapping(pairs: TilingPair[]): Record<number, MinoPattern> {
  const result: Record<number, MinoPattern> = {}
  for (const [minoStr, pairTransform, coord] of pairs) {
    const mino = Polyomino.fromString(minoStr)
    const pairPoint = new Vector(...coord)
    const pattern: MinoPattern = [
      { mino, coord: Vector.ZERO },
      { mino: mino.transform(pairTransform), coord: pairPoint },
    ]
    for (const transform of transforms) {
      const transformedPattern = transformPattern(pattern, transform)
      result[mino.transform(transform).data] = shiftPattern(
        transformedPattern,
        transformedPattern[0].coord,
      )
    }
  }
  return result
}

// Translation Criterion:
// The polyomino can be split into six segments ABCDEF such that AD, BE, CF are translations

type SegmentPair = [EdgeList, EdgeList]
// A list of pairs, each consisting of an opposite pair of edges
type TransSegments = SegmentPair[]

const transPairs: TilingPair[] = [
  ["1001_1111_0010", "flipMinorDiag", [0, 3]],
  ["11011_01110", "rotateLeft", [1, 2]],
  ["11011_11110", "flipMainDiag", [-3, 5]],
  ["00011_10110_11100", "flipMainDiag", [-3, 5]],
  ["1001_1111_0010_0010", "flipMinorDiag", [1, 3]],
  ["0101_0111_1100_0100", "flipMinorDiag", [-1, 3]],
  ["11110_01010_00011", "rotateRight", [-3, 2]],
  ["00100_11111_10000_10000", "flipMainDiag", [-1, 3]],
  ["01000_11111_10001", "flipMainDiag", [-2, 4]],
  ["1100_0111_1100_1000", "flipMainDiag", [-1, 3]],
  ["00100_11111_10010", "flipMainDiag", [-2, 4]],
  ["11111_10001_00001", "flipMinorDiag", [1, 5]],
  ["001111_111001", "flipMinorDiag", [-5, 1]],
  ["011100_110111", "flipMainDiag", [-3, 5]],
  ["0100_1100_1111_0100", "flipMainDiag", [1, 3]],
  ["01001_11111_10000", "flipMainDiag", [2, 0]],
]

const transPairMap = getPairsMapping(transPairs)

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

function getTransTiling(
  pattern: MinoPattern,
  edges: EdgeList = getPatternEdges(pattern),
): Tiling | undefined {
  // Check if the edges satisfy the translation criterion
  const segments = getTransSegments(edges)
  if (!segments) {
    return undefined
  }
  // FIXME pick two out of the three based on a criterion,
  // such as vector length or segment length
  // the given domain can be translated as-is
  // Get two edge pairs and use them as the basis
  const u = getTransDistance(segments[0])
  const v = getTransDistance(segments[1])
  return { domain: pattern, basis: [u, v] }
}

// Conway Criterion:
// The polyomino can be split into six segments ABCDEF such that:
// AD are translations, and BCEF are each symmetric with respect to 180deg rotation.

const conwayPairs: TilingPair[] = [
  ["11111_01001", "flipMinorDiag", [-4, 1]],
  ["1101_0111_0001_0001", "flipMinorDiag", [3, 1]],
  ["111111_001001", "flipMinorDiag", [-5, 1]],
  ["111111_010010", "rotateLeft", [-5, 3]],
  ["00010_01111_11000_10000", "flipMainDiag", [-1, 3]],
  ["111111_100001", "rotateLeft", [-5, 3]],
  ["11110_10011_00010", "rotateLeft", [-3, 2]],
  ["111111_010001", "flipMinorDiag", [-5, 1]],
  ["10000_10000_11111_01000", "rotateLeft", [0, 4]],
  ["10001_11111_10000", "rotateLeft", [-1, 4]],
]

const conwayPairMap = getPairsMapping(conwayPairs)

/**
 * Tests if the edge list is a palindrome,
 * meaning it is symmetric with respect to 180 degree rotation.
 */
function isPalindrome(edges: EdgeList): boolean {
  if (edges.length === 0) {
    return true
  }
  return range(Math.floor(edges.length / 2)).every(
    (i) => edges[i].dir === edges[edges.length - 1 - i].dir,
  )
}

// Split edges into two edge lists, each of which is a palindrome
// or return undefined if impossible
function getPalindromePairs(edges: EdgeList): [EdgeList, EdgeList] | undefined {
  for (const i of range(0, edges.length)) {
    const [front, back] = splitAt(edges, i)
    if (isPalindrome(front) && isPalindrome(back)) {
      return [front, back]
    }
  }
  return undefined
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

// Flip the given mino placement over the given segment
function flipPlacement(
  placement: MinoPlacement,
  segment: EdgeList,
): MinoPlacement {
  const { mino, coord } = placement
  const minoBotRight = getAnchor(mino.coords(), { x: "end", y: "end" }).add(
    coord,
  )
  // Flip that point over the segment to get the new coordinate
  const newCoord = flipPoint(minoBotRight, segment)
  return { mino: mino.transform("rotateHalf"), coord: newCoord }
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
  return undefined
}

function getConwayTiling(
  pattern: MinoPattern,
  edges: EdgeList = getPatternEdges(pattern),
): Tiling | undefined {
  const segments = getConwaySegments(edges)
  if (!segments) {
    return undefined
  }
  const [a, b, c, d, e, f] = segments
  // Flip the mino over the longest segment and use that as the pattern
  const longestSegment = maxBy([b, c, e, f], (edges) => edges.length)!
  const flipped = pattern.map((placement) =>
    flipPlacement(placement, longestSegment),
  )
  const domain = pattern.concat(flipped)

  // Use the translated pairs as one axis
  const u = getTransDistance([a, d])
  // Pick a segment on the *other* region than the one the longest segment is in
  // FIXME pick a better criterion for this
  const otherSegment = [b, c].includes(longestSegment) ? f : c

  // flip the end of the other segment over
  const endpoint = flipPoint(segmentEnd(otherSegment), longestSegment)
  const v = endpoint.sub(segmentStart(otherSegment))
  return { domain, basis: [u, v] }
}

/**
 * Return a tiling of the plane by the given polyomino, or undefined if no tiling is possible.
 */
export function getTiling(mino: Polyomino): Tiling | undefined {
  // TODO: handle special paired cases
  if (transPairMap[mino.data]) {
    return getTransTiling(transPairMap[mino.data])
  }
  if (conwayPairMap[mino.data]) {
    return getConwayTiling(conwayPairMap[mino.data])
  }
  const pattern: MinoPattern = [{ mino, coord: Vector.ZERO }]
  const edges = getPatternEdges(pattern)

  const transTiling = getTransTiling(pattern, edges)
  if (transTiling) {
    return transTiling
  }

  return getConwayTiling(pattern, edges)
}