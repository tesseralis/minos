import React, { ReactNode } from "react"

interface PackingMeta {
  name: string
  attribution?: ReactNode
}

function GolombBook() {
  return (
    <>
      <a href="https://press.princeton.edu/books/paperback/9780691024448/polyominoes">
        Polyominoes: Puzzles, Patterns, Problems, and Packings - Revised and
        expanded second edition
      </a>{" "}
      by Solomon Golomb
    </>
  )
}

function PolyPages({ href }: { href: string }) {
  return (
    <>
      <a href={href}>The Poly Pages</a> by Andrew L Clarke.
    </>
  )
}

const packingPatterns: PackingMeta[] = [
  { name: "1_4-rect" },
  { name: "1_4-square" },
  {
    name: "5-rect",
    attribution: (
      <>
        <a
          href="https://en.wikipedia.org/wiki/Pentomino#Constructing_rectangular_dimensions"
          target="_blank"
        >
          Pentomino
        </a>
        , Wikipedia
      </>
    ),
  },
  {
    name: "5-square",
    attribution: (
      <>
        <GolombBook />: 7, Figure 11
      </>
    ),
  },
  {
    name: "6-rect",
    attribution: (
      <>
        <PolyPages href="http://www.recmath.com/PolyPages/hexopatts.htm" />,
        "Hexomino Constructions"
      </>
    ),
  },
  {
    name: "6-square",
    attribution: (
      <>
        <PolyPages href="http://www.recmath.com/PolyPages/hexopatts.htm" />,
        "Hexomino Constructions"
      </>
    ),
  },
  {
    name: "7-rect",
    attribution: (
      <>
        <GolombBook />: 72, Figure 103
      </>
    ),
  },
  {
    name: "7-square",
    attribution: (
      <>
        <PolyPages href="http://www.recmath.com/PolyPages/PolyPages/Polyominoes.htm" />
        , "Heptominoes"
      </>
    ),
  },
  {
    name: "8-rect",
    attribution: (
      <>
        <GolombBook />: 113, Figure 175
      </>
    ),
  },
  {
    name: "8-square",
    attribution: (
      <>
        <GolombBook />: 114, Figure 179
      </>
    ),
  },
]

export const patternList = packingPatterns.map((p) => p.name)

export function getAttribution(patternName: string) {
  const { attribution } =
    packingPatterns.find((p) => p.name === patternName) ?? {}
  return attribution
}
