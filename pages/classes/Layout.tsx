import { capitalize } from "lodash"
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

export default function ClassLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  return (
    <Layout>
      <NavAndContent
        columns="24rem 1fr"
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
        gap: 1rem 0.5rem;
        grid-template-columns: repeat(4, 1fr);
        grid-template-areas:
          ".     .    rect  ."
          ".     ferr rect  ."
          "stair ferr stack ."
          "stair fork stack bar"
          "cross fork wing  bar"
          "cross cres wing  ant"
          "range cres btree ant"
          "range tree btree ."
          ".     tree other ."
          ".     .    other .";
      `}
    >
      {DirClass.all().map((cls) => {
        const route = `/classes/${escapeClass(cls.name())}`
        const isActive = router.asPath === route
        return (
          <Link
            key={cls.code()}
            href={route}
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 0.25rem;
              grid-area: ${cls.code()};
              text-decoration: ${isActive ? "underline" : "none"};
            `}
          >
            <ClassIcon
              class={cls}
              fill={"none"}
              stroke={getClassColor(cls.name())}
              size={50}
            />
            {capitalize(cls.name())}
          </Link>
        )
      })}
    </div>
  )
}
