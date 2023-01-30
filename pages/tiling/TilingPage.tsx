import { css } from "@emotion/react"
import { Polyomino } from "mino"

import Tiling from "components/Tiling"
import MinoList from "components/MinoList"
import Layout from "components/Layout"
import Info from "./Info.mdx"
import Link from "next/link"

// TODO add other information in here
function TilingView({ mino }: { mino: Polyomino }) {
  const gridSize = Math.round(Math.sqrt(64 * mino.order) / 2) * 2
  const svgSize = 500
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <Link href="/tiling">Close</Link>
      <Tiling mino={mino} gridSize={gridSize} svgSize={svgSize} />
    </div>
  )
}

export default function TilingPage({ mino }: { mino?: Polyomino }) {
  return (
    <Layout>
      <div
        css={css`
          position: fixed;
          height: 100%;

          display: grid;
          grid-template-columns: 24rem 1fr;
          grid-gap: 2rem;

          > main {
            margin-top: 2rem;
            max-width: 36rem;
          }
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
        <main>{mino ? <TilingView mino={mino} /> : <Info />}</main>
      </div>
    </Layout>
  )
}
