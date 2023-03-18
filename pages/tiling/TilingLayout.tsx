import { css } from "@emotion/react"
import { Polyomino } from "mino"

import Tiling from "components/Tiling"
import MinoList from "components/MinoList"
import Layout from "components/Layout"
import Link from "next/link"
import { ReactElement } from "react"
import { useRouter } from "next/router"
import NavAndContent from "components/NavAndContent"
import Breadcrumbs from "components/Breadcrumbs"
import MinoDiv from "components/MinoDiv"

// TODO add other information in here
export function TilingView({ mino }: { mino: Polyomino }) {
  const gridSize = Math.round(Math.sqrt(64 * mino.order) / 2) * 2
  const minoDiv = (
    <MinoDiv
      mino={mino}
      size={Math.min(30 / mino.height, 15)}
      fill="none"
      stroke="currentcolor"
    />
  )
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <Breadcrumbs
        paths={[
          ["Tiling", "/tiling"],
          [minoDiv, `/tiling/${mino.toString()}`],
        ]}
      />
      <div
        css={css`
          width: 100%;
          max-width: 90vmin;
          margin-bottom: 1rem;
        `}
      >
        <Tiling mino={mino} gridSize={gridSize} />
      </div>
      <Link href={`/catalog/${mino.toString()}`}>Go to catalog entry</Link>
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
