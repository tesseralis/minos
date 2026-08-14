import { isEqual, minBy } from "lodash-es"

import { encode, px, py, sub, type PackedPoint } from "./data"
import { type Edge, type Direction, EdgeList, move } from "./edges"

type PointSet = Set<PackedPoint>

/**
 * Return whether, given a set of coordinates, starting at  point v,
 * we can move in the given direction dir while moving counterclockwise.
 */
function canTurn(points: PointSet, v: PackedPoint, dir: Direction) {
  switch (dir) {
    case "left":
      return !points.has(sub(v, encode(1, 0)))
    case "down":
      return !points.has(v)
    case "right":
      return !points.has(sub(v, encode(0, 1)))
    case "up":
      return !points.has(sub(v, encode(1, 1)))
  }
}
function isBlocked(points: PointSet, v: PackedPoint, dir: Direction) {
  switch (dir) {
    case "up":
      return points.has(sub(v, encode(0, 1)))
    case "right":
      return points.has(v)
    case "down":
      return points.has(sub(v, encode(1, 0)))
    case "left":
      return points.has(sub(v, encode(1, 1)))
  }
}

function turnLeft(dir: Direction) {
  switch (dir) {
    case "left":
      return "down"
    case "down":
      return "right"
    case "right":
      return "up"
    case "up":
      return "left"
  }
}

function turnRight(dir: Direction) {
  switch (dir) {
    case "left":
      return "up"
    case "up":
      return "right"
    case "right":
      return "down"
    case "down":
      return "left"
  }
}

// Pick a start point for the given coordinates
// such that going "down" from the point is a valid edge
function getStartPoint(coords: Set<PackedPoint>) {
  const minY = Math.min(...coords.values().map(py))
  const topRow = coords
    .values()
    .filter((p) => py(p) === minY)
    .toArray()
  return minBy(topRow, px)!
}

/**
 * Return the edges of a mino.
 */
function* iterEdges(coords: Iterable<PackedPoint>): Generator<Edge> {
  let dir: Direction = "down"
  const coordSet = new Set<PackedPoint>(coords)
  const origin = getStartPoint(coordSet)
  let pos = origin
  do {
    if (canTurn(coordSet, pos, dir)) {
      dir = turnLeft(dir)
    } else if (isBlocked(coordSet, pos, dir)) {
      dir = turnRight(dir)
    } else {
      yield { start: pos, dir }
      pos = move(pos, dir)
    }
  } while (!isEqual(pos, origin))
}

function* iterEdgesInner(coords: Iterable<PackedPoint>): Generator<Edge> {
  let dir: Direction = "down"
  const coordSet = new Set<PackedPoint>(coords)
  const origin = getStartPoint(coordSet)
  let pos = origin

  do {
    if (isBlocked(coordSet, pos, dir)) {
      dir = turnRight(dir)
    } else if (canTurn(coordSet, pos, dir)) {
      dir = turnLeft(dir)
    } else {
      yield { start: pos, dir }
      pos = move(pos, dir)
    }
  } while (pos !== origin)
}

/**
 * Get the boundary of a polyomino
 */
export function getEdges(coords: Iterable<PackedPoint>) {
  return new EdgeList(iterEdges(coords).toArray())
}

export function getEdgesInner(coords: Iterable<PackedPoint>) {
  return new EdgeList(iterEdgesInner(coords).toArray())
}
