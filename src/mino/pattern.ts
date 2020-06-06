/**
 * Utility functions for parsing and handling patterns/tilings of polyominoes.
 */

import Polyomino from "./Polyomino"
import { Dims, Coord } from "./data"
import { getNeighbors } from "./relatives"

interface MinoPlacement {
  mino: Polyomino
  coord: Coord
}
type MinoPattern = MinoPlacement[]

function* getCoords([w, h]: Dims) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      yield [x, y] as Coord
    }
  }
}

function inBounds([x, y]: Coord, [w, h]: Dims) {
  return x >= 0 && x < w && y >= 0 && y < h
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
  for (const coord of getCoords(dims)) {
    const [x, y] = coord
    if (visited.has(coord.toString())) {
      continue
    }
    const color = grid[y][x]
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
        const [x1, y1] = nbr
        if (
          inBounds(nbr, dims) &&
          grid[y1]?.[x1] === color &&
          !visited.has(nbr.toString())
        ) {
          queue.push(nbr)
        }
      }
    }
    // get the coordinates of the mino
    const xMin = Math.min(...minoCoords.map((p) => p[0]))
    const yMin = Math.min(...minoCoords.map((p) => p[1]))
    const mino = Polyomino.fromCoords(
      minoCoords.map(([x, y]) => [x - xMin, y - yMin]),
    )
    pattern.push({ mino, coord: [xMin, yMin] })
  }

  return pattern
}

// verify whether the given mino pattern contains all the right minos
export function verifyPattern(pattern: MinoPattern): boolean {
  return false
}
