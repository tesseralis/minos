import { range, zip, maxBy } from "lodash-es"
import Vector from "vector"
import Polyomino from "./Polyomino"
import { Coord } from "./data"
import { EdgeList } from "./edges"
import { Transform, getAnchor, transforms } from "./transform"
import { MinoPlacement, MinoPattern } from "./pattern"
import { O_OCTOMINO } from "./constants"

export type Basis = [u: Coord, v: Coord]

/**
 * Represents a polyomino tiling that can be tesselated by repeating a pattern
 * through translation.
 */
export interface Tiling {
  /** The set of polyominoes that make up the fundamental domain for the tiling */
  domain: MinoPattern

  /** Two vectors that determine how far to translate each repetition of the pattern */
  basis: Basis
}

// Return the distance vector between the two segments
// which are translations of each other
function transSegmentDist([startList, endList]: SegmentPair): Coord {
  // It suffices to compare two counterpart points
  // (e.g. the start of one segment and the end of the other)
  return startList.start().sub(endList.end())
}

// Translation Criterion
// =====================
// The polyomino can be split into six segments ABCDEF such that AD, BE, CF are translations.
// One of the segment pairs may be empty.

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
  for (const rotation of edges.cycle(half)) {
    // split into two parts
    const [front, back] = rotation.splitAt(half)

    // for each partition of at least two pieces, check that each pair are opposites
    for (const partitionIndices of getPartitionIndices(half)) {
      const frontPart = front.splitAt(partitionIndices)
      const backPart = back.splitAt(partitionIndices)
      const pairs = zip(frontPart, backPart)
      if (pairs.every(([a, b]) => a!.isInverse(b!))) {
        return pairs as TransSegments
      }
    }
  }

  // If no partition or rotation matches, this doesn't satisfy the criterion
  return undefined
}

/**
 * Get the tiling given by the translation criterion
 */
function getTransTiling(pattern: MinoPattern): Tiling | undefined {
  // Check if the edges satisfy the translation criterion
  const segments = getTransSegments(pattern.edges())
  if (!segments) {
    return undefined
  }
  // TODO pick two out of the three based on a criterion,
  // such as vector length or segment length
  // the given domain can be translated as-is
  // Get two edge pairs and use them as the basis
  const u = transSegmentDist(segments[0])
  const v = transSegmentDist(segments[1])
  return { domain: pattern, basis: [u, v] }
}

// Conway Criterion
// ================
// The polyomino can be split into six segments ABCDEF such that:
//
//  * AD are translations of each other,
//  * BCEF are each symmetric with respect to 180deg rotation.
//  * Each of the pairs BC, EF may have one empty member.
//  * AD may be empty, if three of the four of BCEF are nonempty.

// Split edges into two edge lists, each of which is a palindrome
// or return undefined if impossible
function getPalindromePair(edges: EdgeList): SegmentPair | undefined {
  for (const i of range(0, edges.length)) {
    const [front, back] = edges.splitAt(i)
    if (front.isPalindrome() && back.isPalindrome()) {
      return [front, back]
    }
  }
  return undefined
}

function getPalindromePairs(bc: EdgeList, ef: EdgeList) {
  const bcPal = getPalindromePair(bc)
  const efPal = getPalindromePair(ef)
  if (bcPal && efPal) {
    return [bcPal, efPal]
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
  return segment.start().add(segment.end()).sub(coord)
}

// Flip the given mino placement over the given palindromic segment
function flipPlacement(
  placement: MinoPlacement,
  segment: EdgeList,
): MinoPlacement {
  const { mino, coord } = placement
  const minoBotRight = getAnchor(mino, { x: "end", y: "end" }).add(coord)
  // Flip that point over the segment to get the new coordinate
  const newCoord = flipPoint(minoBotRight, segment)
  return { mino: mino.transform("rotateHalf"), coord: newCoord }
}

type ConwaySegments = {
  // The distance between the two segments that are translations of each other
  transDistance: Vector
  // The segment pairs that each contain two palindromic segments
  palindromePairs: SegmentPair[]
}

/**
 * Return the segments of the Conway criterion for the given EdgeList,
 * or undefined if the edges do not satisfy the Conway criterion.
 */
function getConwaySegments(edges: EdgeList): ConwaySegments | undefined {
  const half = Math.floor(edges.length / 2)
  // Cycle through all possible permutations
  for (const rotation of edges.cycle()) {
    // For each possible translation pair in the start:
    for (const i of range(1, half - 1)) {
      const [a, tail] = rotation.splitAt(i)
      // try to find the inverse of A in the remaining segment
      let foundInverse = false
      for (const j of range(0, tail.length - a.length - 1)) {
        const [bc, d, ef] = tail.splitAt([j, j + a.length])
        if (a.isInverse(d)) {
          foundInverse = true
          // ensure the remaining segments can be split into two palindromic segments
          const palindromePairs = getPalindromePairs(bc, ef)
          if (palindromePairs) {
            return {
              transDistance: transSegmentDist([a, d]),
              palindromePairs,
            }
          }
        }
      }
      // If no translated twin can be found, none can be found for strings of longer length
      // so break and do the next roation in the cycle
      if (!foundInverse) {
        break
      }
    }
    // Consider the case where A and D are empty.
    // This is pretty rare (only one instance out of the heptominoes)
    // so do this case last for efficiency
    for (const k of range(1, edges.length - 1)) {
      const [bc, ef] = rotation.splitAt(k)
      const palindromePairs = getPalindromePairs(bc, ef)
      if (palindromePairs) {
        return {
          // Use the distance between the empty A-D segments
          transDistance: ef.start().sub(bc.start()),
          palindromePairs,
        }
      }
    }
  }
  return undefined
}

/**
 * Get the tiling given by the Conway criterion.
 */
function getConwayTiling(pattern: MinoPattern): Tiling | undefined {
  const segments = getConwaySegments(pattern.edges())
  if (!segments) {
    return undefined
  }
  const {
    transDistance,
    palindromePairs: [bc, ef],
  } = segments
  // Flip the mino over the longest segment and use that as the pattern
  const longestSegment = maxBy(bc.concat(ef), (edges) => edges.length)!
  const flipped = pattern.data.map((placement) =>
    flipPlacement(placement, longestSegment),
  )
  const domain = new MinoPattern(pattern.data.concat(flipped))

  // Use the distance between the translated pair as one axis
  const u = transDistance

  // Pick a segment on the *other* region than the one the longest segment is in
  // TODO pick a better criterion for this and ensure a nonempty segment is picked
  const otherSegment = bc.includes(longestSegment) ? ef[1] : bc[1]

  // flip the end of the other segment over
  const endpoint = flipPoint(otherSegment.end(), longestSegment)
  const v = endpoint.sub(otherSegment.start())
  return { domain, basis: [u, v] }
}

// Tiling Pairs
// ============
// Some 7- and 8-minos don't satisfy either the translation or Conway criterion,
// but a pair of the mino does.
// we hard-code the list of pairs for efficiency.

type TilingPair = [mino: string, transform: Transform, coord: [number, number]]

function getPairsMapping(pairs: TilingPair[]): Record<number, MinoPattern> {
  const result: Record<number, MinoPattern> = {}
  for (const [minoStr, pairTransform, coord] of pairs) {
    const mino = Polyomino.fromString(minoStr)
    const pairPoint = new Vector(...coord)
    const pattern = new MinoPattern([
      { mino, coord: Vector.ZERO },
      { mino: mino.transform(pairTransform), coord: pairPoint },
    ])
    for (const transform of transforms) {
      const transformedPattern = pattern.transform(transform)
      result[mino.transform(transform).data] = transformedPattern.shift(
        transformedPattern.data[0].coord,
      )
    }
  }
  return result
}

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

const transPairMap = getPairsMapping(transPairs)
const conwayPairMap = getPairsMapping(conwayPairs)

// The tiling function
// ===================

// Return whether the mino has a hole
function hasHole(mino: Polyomino) {
  // For n <= 8, only one mino has a hole
  return mino.equals(O_OCTOMINO)
}

/**
 * Return a tiling of the plane by the given polyomino, or undefined if no tiling is possible.
 */
export function getTiling(mino: Polyomino): Tiling | undefined {
  if (hasHole(mino)) {
    return undefined
  }
  // TODO: handle special paired cases
  if (transPairMap[mino.data]) {
    return getTransTiling(transPairMap[mino.data])
  }
  if (conwayPairMap[mino.data]) {
    return getConwayTiling(conwayPairMap[mino.data])
  }
  const pattern = new MinoPattern([{ mino, coord: Vector.ZERO }])

  const transTiling = getTransTiling(pattern)
  if (transTiling) {
    return transTiling
  }

  return getConwayTiling(pattern)
}
