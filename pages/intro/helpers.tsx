import { css } from "@emotion/react"
import { Polyomino } from "mino"
import MinoLink from "components/MinoLink"
import { getMinoColor, getSymmetryColor } from "components/graph"
import { media } from "style/media"
import Link from "next/link"
import { capitalize } from "lodash"
import { colors } from "style/theme"
import Tiling from "components/Tiling"
import MinoPattern from "components/Pattern"
import tinycolor from "tinycolor2"
import MinoDiv from "components/MinoDiv"
import SymmetryMarkers from "components/SymmetryMarkers"
import { nodes } from "components/graph"

const minos = [
  "1",
  "01_11",
  "010_111",
  "101_111",
  "110_101_111",
  "0010_1110_0111_0100",
]

export function MinoList() {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        @media ${media.sm} {
          gap: 2rem;
        }
      `}
    >
      {minos.map((minoStr) => {
        const mino = Polyomino.fromString(minoStr)
        return (
          <MinoLink
            key={minoStr}
            mino={mino}
            to={`catalog/${mino.transform.free()}`}
            size={15}
            {...getMinoColor(mino)}
          />
        )
      })}
    </div>
  )
}

export function LinkCards() {
  return (
    <div
      css={css`
        display: grid;
        grid-auto-rows: 1fr;
        gap: 1rem;
        font-size: 1rem;

        grid-template-columns: repeat(1, 1fr);

        @media ${media.sm} {
          grid-template-columns: repeat(2, 1fr);
        }

        @media ${media.md} {
          grid-template-columns: repeat(3, 1fr);
        }
      `}
    >
      {cards.map(({ name, description, thumbnail }) => {
        return (
          <Link
            key={name}
            href={`/${name}`}
            css={css`
              border: 1px solid ${colors.border};
              text-decoration: none;
              transition: background-color 150ms ease-in-out;
              :hover {
                background-color: ${colors.bg2};
              }
            `}
          >
            <div
              css={css`
                height: 8rem;
                background-color: ${colors.bg};
                overflow: hidden;
              `}
            >
              {thumbnail}
            </div>
            <div
              css={css`
                padding: 0.5rem;
              `}
            >
              <div
                css={css`
                  color: ${colors.heading};
                `}
              >
                {capitalize(name)}
              </div>
              <div>{description}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

const cards = [
  {
    name: "catalog",
    description:
      "A list of polyominoes up to octominoes with a summary of their properties.",
    thumbnail: <CatalogThumbnail />,
  },
  {
    name: "symmetry",
    description:
      "An explanation of the different types of symmetries a polyomino can have.",
    thumbnail: <SymmetryThumbnail />,
  },
  {
    name: "classes",
    description:
      'A hierarchial categorization of polyominoes based on "directedness".',
  },
  {
    name: "packing",
    description: "Fitting a set of polyominoes tightly in some container.",
    thumbnail: <PatternThumbnail />,
  },
  {
    name: "Tiling",
    description: "Whether a single polyomino can completely fill the plane.",
    thumbnail: <TilingThumbnail />,
  },
  {
    name: "genealogy",
    description:
      'A "family tree" showing how polyominoes are built from simpler polyominoes.',
  },
  {
    name: "glossary",
    description: "A list of polyomino-related terms.",
  },
]

function CatalogThumbnail() {
  const pentominoes = nodes[5 - 1]
  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem;
        justify-content: space-around;
      `}
    >
      {pentominoes.map((p) => (
        <div
          key={p.data}
          css={css`
            min-width: 10%;
          `}
        >
          <MinoDiv mino={p} size={10} fill="none" stroke="currentcolor" />
        </div>
      ))}
    </div>
  )
}

function SymmetryThumbnail() {
  const minos = [
    ["none", "0010_1111_0110_0100"],
    ["axis", "111_111_101"],
    ["diag", "111_111_011"],
    ["rot", "100_111_111_001"],
    ["all", "111_101_111"],
    ["axis2", "010_111_111_010"],
    ["diag2", "0100_1110_0111_0010"],
    ["rot2", "0100_0111_1110_0010"],
  ]
  return (
    <div
      css={css`
        height: 100%;
        background-color: ${colors.bg};
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 0.5rem;
        justify-items: center;
        align-items: center;
      `}
    >
      {minos.map(([symmetry, minoStr]) => {
        const mino = Polyomino.of(minoStr)
        const color = tinycolor(getSymmetryColor(symmetry as any))
          .desaturate(40)
          .toHexString()
        const size = 12
        return (
          <MinoDiv
            key={mino.data}
            mino={mino}
            stroke="black"
            fill={color}
            size={size}
          >
            <SymmetryMarkers
              mino={mino}
              size={size}
              stroke="white"
              strokeWidth={2}
            />
          </MinoDiv>
        )
      })}
    </div>
  )
}

// I can't believe this is how I'm actually doing this...
function PatternThumbnail() {
  const pattern = `🟥🟩🟩🟧🟧🟧🟧🟨🟨🟨
🟥🟩🟩🟪🟧🟦🟦🟦🟦🟨
🟥🟩🟪🟪🟪🟥🟨🟨🟦🟨
🟥🟦🟧🟪🟥🟥🟥🟨🟪🟪
🟥🟦🟧🟧🟩🟩🟥🟨🟨🟪
🟦🟦🟦🟧🟧🟩🟩🟩🟪🟪`
  return (
    <div
      css={css`
        pointer-events: none;
      `}
    >
      <MinoPattern pattern={pattern} />
    </div>
  )
}

function TilingThumbnail() {
  return <Tiling mino={Polyomino.of("00011_10110_11100")} gridSize={12} />
}
