import React from "react"
import { Coord } from "mino"
import { range } from "lodash-es"
import { css } from "emotion"
import { Polyomino } from "mino"
import { useMatch } from "react-router-dom"
import MinoSvg from "app/MinoSvg"
import { getTiling } from "mino/tiling"
import tinycolor from "tinycolor2"

function scaleCoord(u: Coord, x: number): Coord {
  return [u[0] * x, u[1] * x]
}

function addCoords(u: Coord, v: Coord): Coord {
  return [u[0] + v[0], u[1] + v[1]]
}

const LIMIT = 10

function Tiling({ mino }: { mino: Polyomino }) {
  const tiling = getTiling(mino)
  if (!tiling) {
    return <div>This polyomino does not tile the plane</div>
  }
  const {
    pattern,
    basis: [u, v],
  } = tiling
  return (
    <svg width={800} height={800} viewBox="-200 -200 400 400">
      {range(-LIMIT, LIMIT).map((i) => {
        return range(-LIMIT, LIMIT).map((j) => {
          const translate = addCoords(scaleCoord(u, i), scaleCoord(v, j))
          const color1 = tinycolor.mix(
            "red",
            "green",
            ((i + LIMIT) / (2 * LIMIT)) * 100,
          )
          const color2 = tinycolor.mix(
            "blue",
            "yellow",
            ((j + LIMIT) / (2 * LIMIT)) * 100,
          )
          const color = tinycolor.mix(color1, color2)
          return (
            <>
              {pattern.map((tile, k) => (
                <MinoSvg
                  key={k}
                  mino={tile.mino}
                  coord={scaleCoord(addCoords(tile.coord, translate), 20)}
                  size={20}
                  fill={color.toString()}
                  hideInner
                  stroke="black"
                  anchor="top left"
                />
              ))}
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