import React from "react"
import { css } from "@emotion/react"
import { Polyomino } from "mino"

import Tiling from "./Tiling"
import MinoList from "components/MinoList"

function Index() {
  return (
    <div>
      <h1>Tiling the plane</h1>
      <p>
        A polyomino <em>tiles the plane</em> if it is possible to cover an
        infinite grid with copies of the polyomino such that no holes are left.
      </p>
      <p>Select a polyomino to see its tiling.</p>
    </div>
  )
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
      <div>{mino ? <Tiling mino={mino} /> : <Index />}</div>
    </div>
  )
}
