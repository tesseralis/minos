import React from "react"
import { range } from "lodash-es"
import { Polyomino } from "mino"
import MinoSvg from "app/MinoSvg"
import { Basis, getTiling } from "mino/tiling"

function mod(n: number, d: number) {
  const rem = n % d
  return rem < 0 ? rem + d : rem
}

function inBounds(n: number, limit: number) {
  return n >= -limit && n <= limit
}

// Return the set of indices [i, j] such that iu + vj falls within the square of size s*s
// centered at 0, with the buffer area [w, h]
function* getIndices(
  [u, v]: Basis,
  size: number,
  [w, h]: [number, number],
): Generator<[number, number]> {
  // TODO (perf) make this more sophisticated
  for (const i of range(-size, size)) {
    for (const j of range(-size, size)) {
      const { x, y } = u.scale(i).add(v.scale(j))
      if (inBounds(x, size / 2 + w) && inBounds(y, size / 2 + h)) {
        yield [i, j]
      }
    }
  }
}

const colors = ["#eb4f3b", "#ebbc21", "#378ee6", "#d1c9b4"]
function getColor(domLength: number, patIdx: number, i: number, j: number) {
  switch (domLength) {
    // If the domain has only one mino,
    // then use a different color for each set of four
    case 1:
      return colors[2 * mod(i, 2) + mod(j, 2)]
    // If it has two minos, use two of the colors for them and alternate based on the parity of i+j
    case 2:
      return colors[2 * mod(i + j, 2) + patIdx]
    // Otherwise, color each mino in the domain differently
    default:
      return colors[patIdx]
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
  const length = Math.round(Math.sqrt(64 * mino.order) / 2) * 2
  const viewLength = squareSize * length

  const tiling = getTiling(mino)
  if (!tiling) {
    // TODO (impl) actually show the mino.
    return <div>This polyomino does not tile the plane.</div>
  }
  const { domain, basis } = tiling
  const [u, v] = basis
  const indices = [...getIndices(basis, length, tiling.domain.dims())]
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`${-viewLength / 2} ${
        -viewLength / 2
      } ${viewLength} ${viewLength}`}
    >
      {indices.map(([i, j]) => {
        const translate = u.scale(i).add(v.scale(j))
        return domain.data.map((tile, k) => {
          const color = getColor(domain.data.length, k, i, j)
          return (
            <MinoSvg
              key={`${i},${j},${k}`}
              mino={tile.mino}
              coord={tile.coord.add(translate).scale(squareSize)}
              size={squareSize}
              fill={color}
              hideInner
              stroke="black"
              anchor="top left"
            />
          )
        })
      })}
    </svg>
  )
}
