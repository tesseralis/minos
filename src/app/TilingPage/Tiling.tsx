import React from "react"
import { range } from "lodash-es"
import { Polyomino } from "mino"
import MinoSvg from "app/MinoSvg"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { getTiling } from "mino/tiling"

function mod(n: number, d: number) {
  const rem = n % d
  return rem < 0 ? rem + d : rem
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
// TODO (impl) this should be calculated dynamically
const iterLimit = 5

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
  const {
    domain,
    basis: [u, v],
  } = tiling

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`${-viewLength / 2} ${
        -viewLength / 2
      } ${viewLength} ${viewLength}`}
    >
      {range(-iterLimit, iterLimit + 1).map((i) => {
        return range(-iterLimit, iterLimit + 1).map((j) => {
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
        })
      })}
    </svg>
  )
}
