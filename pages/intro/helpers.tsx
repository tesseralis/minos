import React from "react"
import { css } from "@emotion/react"
import { Polyomino, DirClass } from "mino"
import MinoLink from "components/MinoLink"
import { getClassColor, getMinoColor, getSymmetryColor } from "components/graph"
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
import ClassIcon from "components/ClassIcon"
import MinoSvg from "components/MinoSvg"
import Vector from "lib/vector"
import { Line } from "components/svg"

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
                height: 12rem;
                background-color: ${colors.bg};
                overflow: hidden;
                @media ${media.sm} {
                  height: 10rem;
                }
                @media ${media.md} {
                  height: 8rem;
                }
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
    thumbnail: <ClassThumbnail />,
  },
  {
    name: "packing",
    description: "Fitting a set of polyominoes tightly in some container.",
    thumbnail: <PatternThumbnail />,
  },
  {
    name: "tiling",
    description: "Whether a single polyomino can completely fill the plane.",
    thumbnail: <TilingThumbnail />,
  },
  {
    name: "genealogy",
    description:
      'A "family tree" showing how polyominoes are built from simpler polyominoes.',
    thumbnail: <GenealogyThumbnail />,
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
            flex-basis: 10%;
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

function ClassThumbnail() {
  return (
    <div
      css={css`
        margin: 0.5rem;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
      `}
    >
      {DirClass.all().map((cls) => {
        return (
          <ClassIcon
            key={cls.name()}
            class={cls}
            size={28}
            fill="none"
            stroke={getClassColor(cls.name())}
          />
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

function GenealogyThumbnail() {
  const mino = Polyomino.of("01_11_01")
  const children = [...mino.relatives.freeChildren()]
  const radius = 30
  return (
    <svg viewBox="-50 -10 100 50">
      {children.map((child, i) => {
        const angle =
          (i / (children.length - 1)) * Math.PI * (22 / 24) + Math.PI / 24
        const coord = new Vector(
          radius * Math.cos(angle),
          radius * Math.sin(angle),
        )
        return (
          <>
            <Line
              p1={[0, 0]}
              p2={coord}
              stroke="currentColor"
              strokeWidth={0.2}
            />
            <MinoSvg
              mino={child}
              fill={colors.bg}
              stroke="currentColor"
              coord={coord}
              size={3}
            />
          </>
        )
      })}
      <MinoSvg
        mino={mino}
        fill={colors.bg}
        stroke="currentColor"
        coord={new Vector(0, 0)}
        size={4}
      />
    </svg>
  )
}
