import { maxBy } from "lodash-es"
import Polyomino from "./Polyomino"
import { Coord } from "./data"
import { Direction, move } from "./draw"

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

type Segments = [
  a: EdgeList,
  b: EdgeList,
  c: EdgeList,
  d: EdgeList,
  e: EdgeList,
  f: EdgeList,
]

/**
 * Convert the given mino into an edge list representation.
 */
function toEdgeList(mino: Polyomino): EdgeList {
  //
  throw new Error("Not implemented")
}

/**
 * Return the segments of the translation criterion for the given EdgeList,
 * or undefined if the edges do not satisfy the translation criterion.
 */
function getTransSegments(edges: EdgeList): Segments | undefined {
  throw new Error("Not implemented")
}

/**
 * Return the segments of the Conway criterion for the given EdgeList,
 * or undefined if the edges do not satisfy the Conway criterion.
 */
function getConwaySegments(edges: EdgeList): Segments | undefined {
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
function getTransDistance(startList: EdgeList, endList: EdgeList): Coord {
  const startEdge = startList[0]
  const endEdge = endList[endList.length - 1]
  return getCoordDistance(startEdge.start, getEndCoord(endEdge))
}

// Get the basis for the translation criterion segments
function getTransBasis(segments: Segments): Basis {
  const [a, b, c, d, e, f] = segments
  const u1 = getTransDistance(a, d)
  const u2 = getTransDistance(b, e)
  // const u3 = getTransDistance(c, f)
  // FIXME pick two out of the three based on a criterion,
  // such as vector length or segment length
  return [u1, u2]
}

/**
 * Get the inverse mino position flipped over the given edge.
 */
function getRotated(mino: Polyomino, segment: EdgeList): MinoPlacement {
  throw new Error("Not implemented")
}

/**
 * Return a tiling of the plane by the given polyomino, or undefined if no tiling is possible.
 */
export function getTiling(mino: Polyomino): Tiling | undefined {
  // TODO: handle special paired cases

  const edges = toEdgeList(mino)

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
    const inverse = getRotated(mino, longestSegment)
    const pattern: MinoPlacement[] = [{ coord: [0, 0], mino }, inverse]

    // Use the translated pairs as one axis
    const u = getTransDistance(a, d)
    const v = u // FIXME this is something really complicated I can't express easily
    return { pattern, basis: [u, v] }
  }

  return undefined
}
