import React from "react"
import { range } from "lodash-es"
import { Polyomino } from "mino"
import MinoSvg from "app/MinoSvg"
import { Tiling as MinoTiling } from "mino/tiling"
import Vector from "vector"

// Mod except it works for negative numbers
function mod(n: number, d: number) {
  const rem = n % d
  return rem < 0 ? rem + d : rem
}

function mod2(n: number) {
  return mod(n, 2)
}

const colors = ["#eb4f3b", "#ebbc21", "#378ee6", "#d1c9b4"]
function getColor(domLength: number, i: number, j: number, patIdx: number) {
  switch (domLength) {
    // If the domain has only one mino,
    // then use a different color for each set of four
    case 1:
      return 2 * mod2(i) + mod2(j)
    // If it has two minos, use two of the colors for them and alternate based on the parity of i+j
    case 2:
      return 2 * mod2(i + j) + patIdx
    // Otherwise, color each mino in the domain differently
    default:
      return patIdx
  }
}

function inBounds(n: number, limit: number) {
  return n >= -limit && n <= limit
}

function inBox(p: Vector, size: number) {
  const halfSize = Math.ceil(size / 2)
  return inBounds(p.x, halfSize) && inBounds(p.y, halfSize)
}

interface Tile {
  coord: Vector
  mino: Polyomino
  // the color index
  color: number
}

// Get all the tiles that can be drawn on a square grid of the given size
function* getTiles(tiling: MinoTiling, size: number): Generator<Tile> {
  const {
    basis: [u, v],
    domain,
  } = tiling
  for (const i of range(-size, size)) {
    for (const j of range(-size, size)) {
      for (const k of range(domain.data.length)) {
        const { coord, mino } = domain.data[k]
        const p = u.scale(i).add(v.scale(j)).add(coord)
        // Only add the tile if some point in the mino is visible within the grid
        if (mino.coords().some((c) => inBox(p.add(c), size))) {
          yield {
            coord: p,
            mino,
            color: getColor(domain.data.length, i, j, k),
          }
        }
      }
    }
  }
}

// How many svg units each square should be
const squareSize = 20
// Width/height of the svg
const svgSize = 500

interface Props {
  mino: Polyomino
}
export default function Tiling({ mino }: Props) {
  // Normalize the number of unit squares so that approximately 64 minos are shown
  // (for monominoes, this is the size of a checkerboard)
  // Also make sure that the side length is even
  const gridSize = Math.round(Math.sqrt(64 * mino.order) / 2) * 2
  const viewLength = squareSize * gridSize

  const tiling = mino.tiling()
  if (!tiling) {
    // TODO (impl) actually show the mino.
    return <div>This polyomino does not tile the plane.</div>
  }
  const tiles = [...getTiles(tiling, gridSize)]

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`${-viewLength / 2} ${
        -viewLength / 2
      } ${viewLength} ${viewLength}`}
    >
      {tiles.map(({ coord, mino, color }, key) => {
        return (
          <MinoSvg
            key={key}
            mino={mino}
            coord={coord.scale(squareSize)}
            size={squareSize}
            fill={colors[color]}
            gridStyle="thin"
            stroke="black"
            anchor="top left"
          />
        )
      })}
    </svg>
  )
}
