import React from "react"
import { range } from "lodash-es"
import { css } from "emotion"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"
import MinoSvg from "app/MinoSvg"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { getTiling } from "mino/tiling"

const colors = ["#eb4f3b", "#ebbc21", "#378ee6", "#acbdbb"]
function mod(n: number, d: number) {
  const rem = n % d
  return rem < 0 ? rem + d : rem
}

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

const minoSize = 20
const svgSize = 500
// TODO (impl) this should be calculated dynamically
const iterLimit = 5

function Tiling({ mino }: { mino: Polyomino }) {
  // Normalize the number of unit squares so that approximately 64 minos are shown
  // (for monominoes, this is the size of a checkerboard)
  const length = Math.round(Math.sqrt(64 * mino.order))
  const viewLength = minoSize * length

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
                coord={tile.coord.add(translate).scale(minoSize)}
                size={minoSize}
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

export default function TilingPage() {
  const { params } = useMatch("/tiling/:mino")!
  const code = params.mino
  const mino = Polyomino.fromString(code)
  return (
    <div
      className={css`
        width: 100%;
        max-width: 48rem;
        height: 100vh;
        margin-left: 10rem;
        margin-top: 2rem;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Tiling mino={mino} />
    </div>
  )
}
