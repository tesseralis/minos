import React from "react"
import { range } from "lodash-es"
import { css } from "emotion"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"
import MinoSvg from "app/MinoSvg"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { getTiling } from "mino/tiling"

const LIMIT = 5

const colors = ["#d15e5e", "#d64da9", "#9b45bf", "#7253c9"]
function mod(n: number, d: number) {
  const rem = n % d
  return rem < 0 ? rem + d : rem
}

function getColor(domLength: number, patIdx: number, i: number, j: number) {
  // If the domain has only one mino,
  // then use a different color for each set of four
  if (domLength === 1) {
    const iRem = mod(i, 2)
    const jRem = mod(j, 2)
    return colors[2 * iRem + jRem]
  }
  if (domLength === 2) {
    const range = mod(i + j, 2)
    return colors[2 * range + patIdx]
  }
  return colors[patIdx]
}

const minoSize = 20
const svgSize = 500

function Tiling({ mino }: { mino: Polyomino }) {
  // Normalize the number of unit squares so that approximately 64 minos are shown
  // (for monominoes, this is the size of a checkerboard)
  const length = Math.round(Math.sqrt(64 * mino.order))
  const viewLength = minoSize * length

  // If no selection context, set it to the current mino.
  const selected = useSelected()
  const setSelected = useSetSelected()
  if (!selected) {
    setSelected(mino)
  }

  const tiling = getTiling(mino)
  if (!tiling) {
    // TODO actually show the mino.
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
      {range(-LIMIT, LIMIT + 1).map((i) => {
        return range(-LIMIT, LIMIT + 1).map((j) => {
          const translate = u.scale(i).add(v.scale(j))
          return (
            <>
              {domain.data.map((tile, k) => {
                const color = getColor(domain.data.length, k, i, j)
                return (
                  <MinoSvg
                    key={`${i},${j},${k}`}
                    mino={tile.mino}
                    coord={tile.coord.add(translate).scale(minoSize)}
                    size={minoSize}
                    fill={color.toString()}
                    hideInner
                    stroke="black"
                    anchor="top left"
                  />
                )
              })}
            </>
          )
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
