/**
 * Utility functions for parsing and handling patterns/tilings of polyominoes.
 */

import { once } from "lodash-es"
import Vector, { VectorLike } from "vector"
import PointSet from "PointSet"
import { MinoLike } from "./Polyomino"
import { Polyomino } from "./internal"
import { Dims, Coord } from "./data"
import { getNeighbors } from "./relatives"
import {
  getAnchor,
  Transform,
  transformAnchor,
  transformCoord,
} from "./transform"
import { getEdges } from "./outline"
import { EdgeList } from "./edges"

/**
 * Represents the placement of a single polyomino in a coordinate grid
 */
export interface MinoPlacement {
  /** The polyomino to place */
  mino: Polyomino
  /** The position of the polyomino, anchored at the top-left */
  coord: Coord
}

interface PlacementLike {
  mino: MinoLike
  coord: VectorLike
}

export type PatternData = MinoPlacement[]

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

// we use this one because a black/white square has two code points and can't be split easily
const holeColor = "🔲"

export function parsePattern(patternStr: string): PatternData {
  const grid = patternStr
    .trim()
    .split("\n")
    .map((row) => [...row])
  const height = grid.length
  const width = grid[0].length
  const dims: Dims = [width, height]
  const pattern: PatternData = []
  const visited = new PointSet()
  for (const coord of allCoords(dims)) {
    if (visited.has(coord)) {
      continue
    }
    const color = grid[coord.y][coord.x]
    // ignore holes
    if (color === holeColor) {
      visited.add(coord)
      continue
    }
    // Select the next point in the grid that hasn't been visited yet
    const queue: Coord[] = [coord]
    const minoCoords: Coord[] = []

    // Find all the valid points
    while (queue.length > 0) {
      const current = queue.pop()
      minoCoords.push(current!)
      visited.add(current!)
      for (const nbr of getNeighbors(current!)) {
        if (
          inBounds(nbr, dims) &&
          grid[nbr.y]?.[nbr.x] === color &&
          !visited.has(nbr)
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
  return { mino: mino.transform.apply(transform), coord: newCoord }
}

// Get the difference between the maximum and minimum of the given numbers
function getRange(nums: number[]) {
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  return max - min + 1
}

export class MinoPattern {
  data: PatternData

  private constructor(data: PatternData) {
    this.data = data
  }

  static of(data: PlacementLike[]) {
    return new MinoPattern(
      data.map(({ mino, coord }) => ({
        mino: Polyomino.of(mino),
        coord: Vector.of(coord),
      })),
    )
  }

  /** Apply the provided transformation to this pattern */
  transform(transform: Transform): MinoPattern {
    return new MinoPattern(
      this.data.map((mino) => transformMino(mino, transform)),
    )
  }

  /** Translate this pattern so that the given point is the new origin */
  shift(newOrigin: Coord): MinoPattern {
    return new MinoPattern(
      this.data.map(({ mino, coord }) => ({
        mino,
        coord: coord.sub(newOrigin),
      })),
    )
  }

  /** Iterate over the coordinates of this mino pattern */
  *coords(): Generator<Coord> {
    for (const { mino, coord } of this.data) {
      for (const p of mino.coords()) {
        yield p.add(coord)
      }
    }
  }

  /** Get the width and height of the pattern */
  dims(): Dims {
    const coords = [...this.coords()]
    const xs = coords.map((p) => p.x)
    const ys = coords.map((p) => p.y)
    return [getRange(xs), getRange(ys)]
  }

  /** Get the outer edges of this mino pattern */
  edges: () => EdgeList = once(() => {
    return EdgeList.of(getEdges([...this.coords()]))
  })
}
