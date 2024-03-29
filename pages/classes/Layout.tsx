import { capitalize, range } from "lodash"
import { useRouter } from "next/router"
import Link from "next/link"
import { css } from "@emotion/react"
import Layout from "components/Layout"
import { escapeClass } from "./classHelpers"
import ClassIcon from "components/ClassIcon"
import { getClassColor } from "components/graph"
import NavAndContent from "components/NavAndContent"

import { DirClass } from "mino"
import { ReactNode } from "react"
import { colors } from "style/theme"
import ClassSymbol from "./ClassSymbol"
import HierarchyArrow from "components/HierarchyArrow"

export default function ClassLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <NavAndContent
        columns="20rem 1fr"
        nav={
          <div
            css={css`
              padding-top: 2rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1rem;
            `}
          >
            <SubpageNav />
            <Link
              href={`/classes/table`}
              css={css`
                font-size: 1.5rem;
                text-decoration: none;
                padding: 0.5rem 1rem;
                border: 1px solid ${colors.border};
                transition: background-color 150ms ease-in-out;
                :hover {
                  background-color: ${colors.bg2};
                }
              `}
            >
              Full Table
            </Link>
          </div>
        }
      >
        {children}
      </NavAndContent>
    </Layout>
  )
}

function SubpageNav() {
  const router = useRouter()
  return (
    <div
      css={css`
        display: grid;
        align-content: start;
        gap: 0.125rem 0;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(10, 1fr);
        grid-template-areas:
          ".     .     rect  ."
          ".     wedge rect  ."
          "stair wedge stack ."
          "stair fork  stack bar"
          "diam  fork  wing  bar"
          "diam  cres  wing  ant"
          "range cres  btree ant"
          "range tree  btree ."
          ".     tree  other ."
          ".     .     other .";
      `}
    >
      {DirClass.all().map((cls) => {
        const route = `/classes/${escapeClass(cls.name())}`
        const isActive = router.asPath === route
        return (
          <Link
            key={cls.code()}
            href={route}
            data-active={isActive}
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 0.25rem;
              grid-area: ${cls.code()};
              line-height: 1;
              text-decoration: none;
              &[data-active="true"] {
                color: ${colors.highlight};
              }

              padding: 0.5rem;
              border-radius: 4px;
              transition: background-color 150ms ease-in-out;

              :hover {
                background-color: ${colors.bg2};
              }
            `}
          >
            <ClassIcon
              class={cls}
              fill={"none"}
              stroke={getClassColor(cls.name())}
              size={50}
            />
            {capitalize(cls.name())}
            <div
              css={css`
                font-size: 0.75rem;
                color: ${colors.muted};
              `}
            >
              <ClassSymbol dirClass={cls} />
            </div>
          </Link>
        )
      })}
      {range(1, 4).flatMap((col) =>
        range(...rowRanges[col]).map((row) => {
          const direction = (row + col) % 2 === 0 ? "up left" : "up right"
          return (
            <div
              key={`${row},${col}`}
              css={css`
                justify-self: center;
                align-self: center;
                grid-area: ${row} / ${col} / span 2 / span 2;
              `}
            >
              <HierarchyArrow direction={direction} size={15} />
            </div>
          )
        }),
      )}
    </div>
  )
}

const rowRanges: [number, number][] = [
  [0, 0],
  [2, 8],
  [1, 9],
  [3, 7],
]
