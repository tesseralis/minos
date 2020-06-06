/**
 * Utility functions for parsing and handling patterns/tilings of polyominoes.
 */

import Polyomino from "./Polyomino"
import { Coord } from "./data"
import { getNeighbors } from "./relatives"

interface MinoPlacement {
  mino: Polyomino
  coord: Coord
}
type MinoPattern = MinoPlacement[]

const holeColor = "⬛️"

export function parsePattern(patternStr: string): MinoPattern {
  const grid = patternStr
    .trim()
    .split("\n")
    .map((row) => [...row])
  const height = grid.length
  const width = grid[0].length
  const pattern: MinoPattern = []
  const visited: Set<string> = new Set()
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const point: Coord = [x, y]
      // FIXME use an actual point set
      if (visited.has(point.toString())) {
        continue
      }
      const color = grid[y][x]
      if (color === holeColor) {
        visited.add(point.toString())
        continue
      }
      // Select the next point in the grid that hasn't been visited yet
      const queue: Coord[] = [point]
      const minoCoords: Coord[] = []

      // Find all the valid points
      while (queue.length > 0) {
        const current = queue.pop()
        minoCoords.push(current!)
        visited.add(current!.toString())
        for (const nbr of getNeighbors(current!)) {
          const [x1, y1] = nbr
          if (grid[y1]?.[x1] === color) {
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
  }

  return pattern
}

// verify whether the given mino pattern contains all the right minos
export function verifyPattern(pattern: MinoPattern): boolean {
  return false
}
