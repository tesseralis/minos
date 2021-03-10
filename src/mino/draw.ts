import { isEqual, minBy } from "lodash-es"

import { Coord } from "./data"

export type Direction = "left" | "right" | "up" | "down"

function hasCoord(coords: Coord[], p: Coord) {
  return coords.some((p2) => isEqual(p, p2))
}

function canTurn(points: Coord[], [x, y]: Coord, dir: Direction) {
  switch (dir) {
    case "left":
      return !hasCoord(points, [x - 1, y])
    case "down":
      return !hasCoord(points, [x, y])
    case "right":
      return !hasCoord(points, [x, y - 1])
    case "up":
      return !hasCoord(points, [x - 1, y - 1])
  }
}
function isBlocked(coords: Coord[], [x, y]: Coord, dir: Direction) {
  switch (dir) {
    case "up":
      return hasCoord(coords, [x, y - 1])
    case "right":
      return hasCoord(coords, [x, y])
    case "down":
      return hasCoord(coords, [x - 1, y])
    case "left":
      return hasCoord(coords, [x - 1, y - 1])
  }
}

export function move([x, y]: Coord, dir: Direction): Coord {
  switch (dir) {
    case "left":
      return [x - 1, y]
    case "right":
      return [x + 1, y]
    case "down":
      return [x, y + 1]
    case "up":
      return [x, y - 1]
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
  } while (!isEqual(pos, origin))
  return result
}

// FIXME deduplicate/organize
type Edge = { dir: Direction; start: Coord }
type EdgeList = Edge[]

/**
 * Return the coordinates for the outline of a mino
 */
export function getEdgeList(minoCoords: Coord[]): EdgeList {
  const origin = minBy(minoCoords)!
  let pos = origin
  let dir: Direction = "down"
  const result: EdgeList = []
  do {
    if (canTurn(minoCoords, pos, dir)) {
      dir = turnLeft(dir)
    } else if (isBlocked(minoCoords, pos, dir)) {
      dir = turnRight(dir)
    } else {
      result.push({ start: pos, dir })
      pos = move(pos, dir)
    }
  } while (!isEqual(pos, origin))
  return result
}
