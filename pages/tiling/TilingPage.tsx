import { css } from "@emotion/react"
import { Polyomino } from "mino"

import Tiling from "components/Tiling"
import MinoList from "components/MinoList"
import Info from "./Info.mdx"

// TODO add other information in here
function TilingView({ mino }: { mino: Polyomino }) {
  const gridSize = Math.round(Math.sqrt(64 * mino.order) / 2) * 2
  const svgSize = 500
  return <Tiling mino={mino} gridSize={gridSize} svgSize={svgSize} />
}

export default function TilingPage({ mino }: { mino?: Polyomino }) {
  return (
    <div
      css={css`
        width: 100%;
        max-width: 54rem;
        height: 100vh;
        margin-left: 10rem;
        padding-top: 3rem;
        display: grid;
        grid-template-columns: 24rem 1fr;
        grid-gap: 2rem;
      `}
    >
      <div
        css={css`
          overflow-y: scroll;
        `}
      >
        {/* TODO (perf): starting with an initial filter makes this really slow */}
        <MinoList
          narrow
          initFilter={{ yesNo: { hasTiling: "yes" } }}
          selected={mino}
          to={(mino) => `/tiling/${mino.toString()}`}
        />
      </div>
      <div>{mino ? <TilingView mino={mino} /> : <Info />}</div>
    </div>
  )
}
