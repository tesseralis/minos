import React from "react"
import { range } from "lodash-es"
import { css } from "emotion"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"
import MinoSvg from "app/MinoSvg"
import { getTiling } from "mino/tiling"

const LIMIT = 10

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

const side = 400

function Tiling({ mino }: { mino: Polyomino }) {
  const tiling = getTiling(mino)
  if (!tiling) {
    return <div>This polyomino does not tile the plane</div>
  }
  const {
    domain,
    basis: [u, v],
  } = tiling
  return (
    <svg
      width={600}
      height={600}
      viewBox={`${-side / 2} ${-side / 2} ${side} ${side}`}
    >
      {range(-LIMIT, LIMIT).map((i) => {
        return range(-LIMIT, LIMIT).map((j) => {
          const translate = u.scale(i).add(v.scale(j))
          return (
            <>
              {domain.map((tile, k) => {
                const color = getColor(domain.length, k, i, j)
                return (
                  <MinoSvg
                    key={`${i},${j},${k}`}
                    mino={tile.mino}
                    coord={tile.coord.add(translate).scale(20)}
                    size={20}
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
