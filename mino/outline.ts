import { isEqual, minBy } from "lodash"

import PointSet from "lib/PointSet"

import { Coord } from "./data"
import { Edge, Direction, EdgeList, move } from "./edges"

/**
 * Return whether, given a set of coordinates, starting at  point v,
 * we can move in the given direction dir while moving counterclockwise.
 */
function canTurn(points: PointSet, v: Coord, dir: Direction) {
  switch (dir) {
    case "left":
      return !points.has(v.add([-1, 0]))
    case "down":
      return !points.has(v)
    case "right":
      return !points.has(v.add([0, -1]))
    case "up":
      return !points.has(v.add([-1, -1]))
  }
}
function isBlocked(points: PointSet, v: Coord, dir: Direction) {
  switch (dir) {
    case "up":
      return points.has(v.add([0, -1]))
    case "right":
      return points.has(v)
    case "down":
      return points.has(v.add([-1, 0]))
    case "left":
      return points.has(v.add([-1, -1]))
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
function getStartPoint(coords: Coord[]) {
  const minY = Math.min(...coords.map((coord) => coord.y))
  const topRow = coords.filter((p) => p.y === minY)
  return minBy(topRow, (p) => p.x)!
}

/**
 * Return the edges of a mino.
 */
function* iterEdges(coords: Coord[]): Generator<Edge> {
  const origin = getStartPoint(coords)
  let pos = origin
  let dir: Direction = "down"
  const coordSet = new PointSet()
  coordSet.addAll(coords)
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

/**
 * Get the boundary of a polyomino
 */
export function getEdges(coords: Coord[]) {
  return EdgeList.of(iterEdges(coords))
}
