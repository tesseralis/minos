/**
 * Utility functions for parsing and handling patterns/tilings of polyominoes.
 */

import Vector from "vector"
import Polyomino from "./Polyomino"
import { Dims, Coord } from "./data"
import { getNeighbors } from "./relatives"
import {
  getAnchor,
  Transform,
  transformAnchor,
  transformCoord,
} from "./transform"

/**
 * Represents the placement of a single polyomino in a coordinate grid
 */
export interface MinoPlacement {
  /** The polyomino to place */
  mino: Polyomino
  /** The position of the polyomino, anchored at the top-left */
  coord: Coord
}

export type MinoPattern = MinoPlacement[]

// Get all possible coordinates within the dimensions
function* allCoords([w, h]: Dims) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      yield new Vector(x, y)
    }
  }
}

function inBounds(p: Coord, [w, h]: Dims) {
  return p.x >= 0 && p.x < w && p.y >= 0 && p.y < h
}

// a black/white square has two code points and can't be split easily
// TODO use runes instead for flexibility:
// https://www.npmjs.com/package/runes
const holeColor = "🔲"

export function parsePattern(patternStr: string): MinoPattern {
  const grid = patternStr
    .trim()
    .split("\n")
    .map((row) => [...row])
  const height = grid.length
  const width = grid[0].length
  const dims: Dims = [width, height]
  const pattern: MinoPattern = []
  const visited: Set<string> = new Set()
  for (const coord of allCoords(dims)) {
    if (visited.has(coord.toString())) {
      continue
    }
    const color = grid[coord.y][coord.x]
    // ignore holes
    if (color === holeColor) {
      visited.add(coord.toString())
      continue
    }
    // Select the next point in the grid that hasn't been visited yet
    const queue: Coord[] = [coord]
    const minoCoords: Coord[] = []

    // Find all the valid points
    while (queue.length > 0) {
      const current = queue.pop()
      minoCoords.push(current!)
      visited.add(current!.toString())
      for (const nbr of getNeighbors(current!)) {
        if (
          inBounds(nbr, dims) &&
          grid[nbr.y]?.[nbr.x] === color &&
          !visited.has(nbr.toString())
        ) {
          queue.push(nbr)
        }
      }
    }
    // get the coordinates of the mino
    const xMin = Math.min(...minoCoords.map((p) => p.x))
    const yMin = Math.min(...minoCoords.map((p) => p.y))
    const min = new Vector(xMin, yMin)
    const mino = Polyomino.fromCoords(minoCoords.map((p) => p.sub(min)))
    pattern.push({ mino, coord: min })
  }

  return pattern
}

function transformMino({ mino, coord }: MinoPlacement, transform: Transform) {
  const newAnchor = transformAnchor(transform)
  // Get the *current* position of the coord that will be the new top-left anchor
  const newAnchorCoord = coord.add(getAnchor(mino, newAnchor))

  const newCoord = transformCoord(newAnchorCoord, transform)
  return { mino: mino.transform(transform), coord: newCoord }
}

export function transformPattern(pattern: MinoPattern, transform: Transform) {
  return pattern.map((placement) => transformMino(placement, transform))
}

export function shiftPattern(pattern: MinoPattern, newOrigin: Coord) {
  return pattern.map(({ mino, coord }) => ({
    mino,
    coord: coord.sub(newOrigin),
  }))
}

/**
 * Iterate over all coordinates of the given pattern.
 */
export function* toCoords(pattern: MinoPattern): Generator<Coord> {
  for (const { mino, coord } of pattern) {
    for (const p of mino.coords()) {
      yield p.add(coord)
    }
  }
}

// verify whether the given mino pattern contains all the right minos
// TODO implement this and write a test for all patterns we have
export function verifyPattern(pattern: MinoPattern): boolean {
  return false
}
