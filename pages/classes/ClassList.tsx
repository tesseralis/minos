import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import MinoLink from "components/MinoLink"
import { chunk } from "lodash"
import { DirClass, Polyomino } from "mino"
import { colors } from "style/theme"
import { getBoundaryFamilies } from "./classHelpers"

function BoundaryFamily({
  family,
  minos,
}: {
  family: string
  minos: Polyomino[]
}) {
  return (
    <div
      css={css`
        border: 1px dimgray solid;
        padding: 1rem;
        border-radius: 1rem;
      `}
    >
      <BoundaryWord word={family} />
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
        `}
      >
        {minos.map((mino) => {
          const { stroke, fill } = getMinoColor(mino)
          return (
            <MinoLink
              key={mino.data}
              to={`/catalog/${mino.toString()}`}
              mino={mino}
              size={8}
              fill={fill}
              stroke={stroke}
            />
          )
        })}
      </div>
    </div>
  )
}

function BoundaryWord({ word }: { word: string }) {
  // reconfigure the word so that it starts with "ru"
  const startIndex = word.indexOf("ru")
  const cycled = word.substring(startIndex) + word.substring(0, startIndex)
  const segments = chunk(cycled, 2).map((segment) => segment.join(""))
  return (
    <div
      css={css`
        font-family: monospace;
        display: flex;
        gap: 0.25rem;
      `}
    >
      {segments.map((segment, index) => (
        <span
          key={index}
          css={css`
            color: ${colorMap[segment] ?? colors.fg};
          `}
        >
          {segment}
        </span>
      ))}
    </div>
  )
}

const colorMap: Record<string, string> = {
  ru: colors.palette[1],
  lu: colors.palette[2],
  ld: colors.palette[3],
  rd: colors.palette[0],
}

export default function ClassList({ dirClass }: { dirClass: DirClass }) {
  const families = getBoundaryFamilies(dirClass.name())
  return (
    <div
      css={css`
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
        margin: -0.5rem;

        > * {
          margin: 0.5rem;
        }
      `}
    >
      {families.map(({ family, minos }, key) => {
        return <BoundaryFamily family={family} minos={minos} key={key} />
      })}
    </div>
  )
}
