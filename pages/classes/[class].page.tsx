import { capitalize } from "lodash"
import type { GetStaticProps } from "next"
import { useRouter } from "next/router"
import Link from "next/link"
import { css } from "@emotion/react"
import Layout from "components/Layout"
import { escapeClass, unescapeClass } from "./classHelpers"
import ClassList from "./ClassList"
import ClassIcon from "components/ClassIcon"
import { getClassColor } from "components/graph"
import NavAndContent from "components/NavAndContent"

import antler from "./subpages/antler.mdx"
import barChart from "./subpages/bar-chart.mdx"
import bentTree from "./subpages/bent-tree.mdx"
import crescent from "./subpages/crescent.mdx"
import cross from "./subpages/cross.mdx"
import ferrersDiagram from "./subpages/ferrers-diagram.mdx"
import fork from "./subpages/fork.mdx"
import other from "./subpages/other.mdx"
import rangeChart from "./subpages/range-chart.mdx"
import rectangle from "./subpages/rectangle.mdx"
import stack from "./subpages/stack.mdx"
import staircase from "./subpages/staircase.mdx"
import tree from "./subpages/tree.mdx"
import wing from "./subpages/wing.mdx"
import { DirClass } from "mino"
import { ClassRegex } from "./words"
import Automaton from "./Automaton"
import ClassSymbol from "./ClassSymbol"

const pages = {
  antler,
  "bar chart": barChart,
  "bent tree": bentTree,
  crescent,
  cross,
  "Ferrers diagram": ferrersDiagram,
  fork,
  other,
  "range chart": rangeChart,
  rectangle,
  stack,
  staircase,
  tree,
  wing,
}

interface Props {
  class: string
}

export default function ClassInfo({ class: cls }: Props) {
  const router = useRouter()
  const Text = (pages as any)[cls]
  const dirClass = DirClass.fromName(cls)
  return (
    <Layout>
      <NavAndContent
        columns="24rem 1fr"
        nav={
          <div
            css={css`
              padding-top: 2rem;
              display: grid;
              align-content: start;
              gap: 1.5rem 0.75rem;
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
                    size={60}
                  />
                  {capitalize(cls.name())}
                </Link>
              )
            })}
          </div>
        }
      >
        <Link href="/classes">Back</Link>
        <h1
          css={css`
            margin: 0;
          `}
        >
          {capitalize(cls)} polyomino
        </h1>
        <Text />
        <div
          css={css`
            display: flex;
            gap: 2rem;

            h2 {
              font-size: 1.125rem;
              margin: 0;
            }
          `}
        >
          <div>
            <h2>Symbol</h2>
            <ClassSymbol dirClass={dirClass} />
          </div>
          <div>
            <h2>Regex</h2>
            {dirClass.regex() ? <ClassRegex dirClass={dirClass} /> : "--"}
          </div>
        </div>
        {/* <h2>State Machine</h2> */}
        {/* <Automaton dirClass={DirClass.fromName(cls)} /> */}
        <h2>Polyomino list</h2>
        <ClassList dirClass={dirClass} />
      </NavAndContent>
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: DirClass.all().map((cls) => ({
      params: { class: escapeClass(cls.name()) },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // TODO typecheck
  const { class: cls } = params as any
  return { props: { class: unescapeClass(cls) } }
}
