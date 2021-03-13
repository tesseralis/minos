import { zip, isEqual, minBy, range } from "lodash-es"

import Vector from "vector"
import { Coord } from "./data"

export type Direction = "left" | "right" | "up" | "down"

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

function move(p: Coord, dir: Direction): Coord {
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

export type Edge = { dir: Direction; start: Coord }
export type EdgeList = Edge[]

/**
 * Return if the two segments are inverses of each other.
 */
export function isInverse(a: EdgeList, b: EdgeList): boolean {
  const bInv = [...b].reverse()
  const pairs = zip(a, bInv)
  return pairs.every(([a, b]) => getOppositeDir(a!.dir) === b!.dir)
}

export function segmentStart(edges: EdgeList): Coord {
  return edges[0].start
}

export function segmentEnd(edges: EdgeList): Coord {
  const edge = edges[edges.length - 1]
  return move(edge.start, edge.dir)
}

/**
 * Tests if the edge list is a palindrome,
 * meaning it is symmetric with respect to 180 degree rotation.
 */
export function isPalindrome(edges: EdgeList): boolean {
  if (edges.length === 0) {
    return true
  }
  return range(Math.floor(edges.length / 2)).every(
    (i) => edges[i].dir === edges[edges.length - 1 - i].dir,
  )
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
