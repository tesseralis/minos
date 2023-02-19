import { css } from "@emotion/react"
import { Polyomino } from "mino"

import Tiling from "components/Tiling"
import MinoList from "components/MinoList"
import Layout from "components/Layout"
import Link from "next/link"
import { ReactElement } from "react"
import { useRouter } from "next/router"
import NavAndContent from "components/NavAndContent"

// TODO add other information in here
export function TilingView({ mino }: { mino: Polyomino }) {
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

export default function TilingLayout({ children }: { children: ReactElement }) {
  const router = useRouter()
  const { mino } = router.query
  return (
    <Layout>
      <NavAndContent
        columns="24rem 1fr"
        nav={
          <MinoList
            narrow
            initFilter={{ yesNo: { hasTiling: "yes" } }}
            selected={mino ? Polyomino.fromString(mino as any) : null}
            to={(mino) => `/tiling/${mino.toString()}`}
          />
        }
      >
        {children}
      </NavAndContent>
    </Layout>
  )
}
