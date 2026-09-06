/**
 * Utility functions for parsing and handling patterns/tilings of polyominoes.
 */

import {} from "lodash-es"
import { type VectorLike } from "$lib/vector"
import { type MinoLike } from "./Polyomino"
import {
  Polyomino,
  getAnchor,
  type Transform,
  transformAnchor,
  transformCoord,
} from "./internal"
import {
  encode,
  px,
  py,
  neighbors,
  sub,
  encodeVec,
  add,
  type Coord,
} from "./data"
import type { Dims } from "./data"
import { getEdges } from "./outline"

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
      yield encode(x, y)
      // yield new Vector(x, y)
    }
  }
}

function inBounds(p: Coord, [w, h]: Dims) {
  const x = px(p)
  const y = py(p)
  return x >= 0 && x < w && y >= 0 && y < h
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
  const visited = new Set<Coord>()
  for (const coord of allCoords(dims)) {
    if (visited.has(coord)) {
      continue
    }
    const color = grid[py(coord)][px(coord)]
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
      if (!visited.has(current!)) {
        minoCoords.push(current!)
      }
      visited.add(current!)
      for (const nbr of neighbors(current!)) {
        if (
          inBounds(nbr, dims) &&
          grid[py(nbr)]?.[px(nbr)] === color &&
          !visited.has(nbr)
        ) {
          queue.push(nbr)
        }
      }
    }
    // get the coordinates of the mino
    const xMin = Math.min(...minoCoords.map(px))
    const yMin = Math.min(...minoCoords.map(py))
    const min = encode(xMin, yMin)
    const mino = Polyomino.fromData(
      new Int32Array(minoCoords.map((p) => sub(p, min))),
    )
    pattern.push({ mino, coord: min })
  }

  return pattern
}

function transformMino({ mino, coord }: MinoPlacement, transform: Transform) {
  const newAnchor = transformAnchor(transform)
  // Get the *current* position of the coord that will be the new top-left anchor
  const newAnchorCoord = add(coord, getAnchor(mino, newAnchor))

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

  constructor(data: PatternData) {
    this.data = data
  }

  static of(data: PlacementLike[]) {
    return new MinoPattern(
      data.map(({ mino, coord }) => ({
        mino: Polyomino.of(mino),
        coord: encodeVec(coord),
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
        coord: sub(coord, newOrigin),
      })),
    )
  }

  /** Iterate over the coordinates of this mino pattern */
  *coords(): Generator<Coord> {
    for (const { mino, coord } of this.data) {
      for (const p of mino.data) {
        yield add(p, coord)
      }
    }
  }

  /** Get the width and height of the pattern */
  dims(): Dims {
    const coords = [...this.coords()]
    const xs = coords.map(px)
    const ys = coords.map(py)
    return [getRange(xs), getRange(ys)]
  }

  /** Get the outer edges of this mino pattern */
  edges() {
    return getEdges(this.coords())
  }
}
