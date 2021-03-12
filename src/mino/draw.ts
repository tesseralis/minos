import { minBy } from "lodash-es"

import Vector from "vector"
import { Coord } from "./data"

type Direction = "left" | "right" | "up" | "down"

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

/**
 * Return the coordinates for the outline of a mino
 */
export function getOutline(minoCoords: Coord[]) {
  // FIXME this might not be correct?
  const origin = minBy(minoCoords)!
  let pos = origin
  let dir: Direction = "down"
  const result = [origin]
  do {
    if (canTurn(minoCoords, pos, dir)) {
      result.push(pos)
      dir = turnLeft(dir)
    } else if (isBlocked(minoCoords, pos, dir)) {
      result.push(pos)
      dir = turnRight(dir)
    } else {
      pos = move(pos, dir)
    }
  } while (!pos.equals(origin))
  return result
}
