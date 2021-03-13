import { isEqual, minBy } from "lodash-es"

import Vector from "vector"
import { Coord } from "./data"
import { Edge, Direction, move } from "./edges"

function hasCoord(coords: Coord[], p: Coord) {
  return coords.some((p2) => p.equals(p2))
}

/**
 * Return whether, given a set of coordinates, starting at  point v,
 * we can move in the given direction dir while moving counterclockwise.
 */
function canTurn(points: Coord[], v: Coord, dir: Direction) {
  switch (dir) {
    case "left":
      return !hasCoord(points, v.add(new Vector(-1, 0)))
    case "down":
      return !hasCoord(points, v)
    case "right":
      return !hasCoord(points, v.add(new Vector(0, -1)))
    case "up":
      return !hasCoord(points, v.add(new Vector(-1, -1)))
  }
}
function isBlocked(coords: Coord[], v: Coord, dir: Direction) {
  switch (dir) {
    case "up":
      return hasCoord(coords, v.add(new Vector(0, -1)))
    case "right":
      return hasCoord(coords, v)
    case "down":
      return hasCoord(coords, v.add(new Vector(-1, 0)))
    case "left":
      return hasCoord(coords, v.add(new Vector(-1, -1)))
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
export function* getEdges(coords: Coord[]): Generator<Edge> {
  const origin = getStartPoint(coords)
  let pos = origin
  let dir: Direction = "down"
  do {
    if (canTurn(coords, pos, dir)) {
      dir = turnLeft(dir)
    } else if (isBlocked(coords, pos, dir)) {
      dir = turnRight(dir)
    } else {
      yield { start: pos, dir }
      pos = move(pos, dir)
    }
  } while (!isEqual(pos, origin))
}

/**
 * Return the coordinates for the outline of a mino
 */
export function* getOutline(minoCoords: Coord[]): Generator<Coord> {
  let currentDir
  for (const edge of getEdges(minoCoords)) {
    // Only yield coordinates when we turn
    if (currentDir !== edge.dir) {
      currentDir = edge.dir
      yield edge.start
    }
  }
}
