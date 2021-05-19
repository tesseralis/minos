import fs from "fs"
import PackingPage from "./PackingLayout"
import { css } from "@emotion/react"
import Pattern from "components/Pattern"

interface Props {
  pattern: string
}

export default function PackingPatternPage({ pattern }: Props) {
  return (
    <PackingPage>
      <div
        css={css`
          margin-top: 2rem;
          width: 100%;
          display: flex;
          justify-content: center;
        `}
      >
        <Pattern pattern={pattern} />
      </div>
    </PackingPage>
  )
}

const patterns = [
  "1_4-rect",
  "1_4-square",
  "5-rect",
  "5-square",
  "6-rect",
  "6-square",
  "7-rect",
  "7-square",
  "8-rect",
  "8-square",
]

export function getStaticPaths() {
  return {
    paths: patterns.map((pattern) => ({ params: { pattern } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: any) {
  const { pattern } = params
  const patternStr = fs.readFileSync(
    `${process.cwd()}/pages/packing/data/${pattern}.txt`,
    "utf-8",
  )
  return {
    props: { pattern: patternStr },
  }
}
