import fs from "fs"
import PackingPage from "./PackingLayout"
import { css } from "@emotion/react"
import Pattern from "components/Pattern"
import { getAttribution, patternList } from "./packingHelpers"

interface Props {
  pattern: string
  patternName: string
}

export default function PackingPatternPage({ pattern, patternName }: Props) {
  const attribution = getAttribution(patternName)
  return (
    <PackingPage>
      <div
        css={css`
          margin-top: 2rem;
          width: 100%;
          display: flex;
          flex-direction: column;
          /* align-items: left; */

          > svg {
            align-self: center;
          }
        `}
      >
        <Pattern pattern={pattern} />
        <div
          css={css`
            margin: 1rem;
            text-align: center;
          `}
        >
          {attribution}
        </div>
      </div>
    </PackingPage>
  )
}

export function getStaticPaths() {
  return {
    paths: patternList.map((pattern) => ({ params: { pattern } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: any) {
  const { pattern: patternName } = params
  const pattern = fs.readFileSync(
    `${process.cwd()}/pages/packing/data/${patternName}.txt`,
    "utf-8",
  )
  return {
    props: { pattern, patternName },
  }
}
