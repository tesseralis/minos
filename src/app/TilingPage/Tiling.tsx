import React from "react"
import { range, findIndex } from "lodash-es"
import { Polyomino } from "mino"
import MinoSvg from "app/MinoSvg"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { getTiling } from "mino/tiling"
import Vector from "vector"

function mod(n: number, d: number) {
  const rem = n % d
  return rem < 0 ? rem + d : rem
}

function ensurePositive(v: Vector) {
  return v.x < 0 ? v.inverse() : v
}

function normalizeBasis(basis: [Vector, Vector]): [Vector, Vector] {
  // If a member of the basis is positive, return it as the first segment
  const posIdx = findIndex(basis, (p) => p.x >= 0 && p.y >= 0)
  if (posIdx >= 0) {
    const otherIdx = 1 - posIdx
    return [basis[posIdx], ensurePositive(basis[otherIdx])]
  }

  // If a vector has both negative coords, return its inverse
  const negIdx = findIndex(basis, (p) => p.x <= 0 && p.y <= 0)
  if (negIdx >= 0) {
    const otherIdx = 1 - negIdx
    return [basis[negIdx].inverse(), ensurePositive(basis[otherIdx])]
  }

  // If both of them are in the same quadrant, take their difference and make sure it's positive
  const [u, v] = basis
  if (u.x * v.x >= 0 && u.y * v.y >= 0) {
    return [ensurePositive(v.sub(u)), ensurePositive(u)]
  }

  // Otherwise, take their sum and make sure it's positive
  return [ensurePositive(u.add(v)), ensurePositive(u)]
}

function inBounds(n: number, limit: number) {
  return n >= -limit && n <= limit
}

// FIXME what the fuck what's happening to the colors??
function* getIndices(
  [u, v]: [Vector, Vector],
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

const colors = ["#eb4f3b", "#ebbc21", "#378ee6", "#b8b19e"]
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

export default function Tiling({ mino }: { mino: Polyomino }) {
  // Normalize the number of unit squares so that approximately 64 minos are shown
  // (for monominoes, this is the size of a checkerboard)
  const length = Math.round(Math.sqrt(64 * mino.order))
  const viewLength = squareSize * length

  // If no selection context, set it to the current mino.
  // TODO (bug) this triggers a console error when run
  const selected = useSelected()
  const setSelected = useSetSelected()
  if (!selected) {
    setSelected(mino)
  }

  const tiling = getTiling(mino)
  if (!tiling) {
    // TODO (impl) actually show the mino.
    return <div>This polyomino does not tile the plane.</div>
  }
  const { domain, basis } = tiling
  const [u, v] = normalizeBasis(basis)
  const indices = [...getIndices([u, v], length, tiling.domain.dims())]
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
