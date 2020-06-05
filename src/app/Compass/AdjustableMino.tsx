import { isEqual } from "lodash-es"
import { cx, css } from "emotion"
import React from "react"
import tinycolor from "tinycolor2"

import {
  PossibleRelativeLink,
  getSize,
  getCoords,
  getChildren,
  getPossibleParents,
  getOutline,
  O_OCTOMINO,
} from "mino"
import { NUM_GENERATIONS, getMinoColor } from "app/graph"
import { Point, Rect } from "app/svg"
import { getAnchor } from "app/utils"
import { useSetSelected } from "app/SelectedContext"
import { colors } from "style/theme"
import { RelativeCtx, useSelected } from "./compassHelpers"

function getBlockSize(gen: number) {
  return 125 / (gen + 4)
}

/**
 * Return the transform and size of the current selected mino.
 */
function useMinoTransform() {
  const mino = useSelected()
  const size = getBlockSize(getSize(mino))
  const outline = getOutline([...getCoords(mino)])
  const scale = ([x, y]: Point) => [x * size, y * size] as Point
  const [avgX, avgY] = getAnchor(outline.map(scale), "center center")

  const translate = ([x, y]: Point) => [x - avgX, y - avgY] as Point
  const transform = (p: Point) => translate(scale(p))
  return { size, transform }
}

interface SquareProps {
  className: string
  selectedClassName: string
  link: PossibleRelativeLink
}

/**
 * A single possibly selectable mino square
 */
function MinoSquare({ className, selectedClassName, link }: SquareProps) {
  const { mino, coord } = link
  const setSelected = useSetSelected()
  const setRelative = RelativeCtx.useSetValue()
  const { size, transform } = useMinoTransform()
  const selected = RelativeCtx.useValue()
  const isSelected = isEqual(selected?.coord, coord)

  const selectableStyle = css`
    transition: all 150ms ease-in-out;
    transition-property: fill, opacity;
    cursor: pointer;
    pointer-events: initial;
  `

  return (
    <Rect
      className={cx(
        !!mino && selectableStyle,
        className,
        isSelected && selectedClassName,
      )}
      coord={transform(coord)}
      width={size}
      height={size}
      strokeWidth={(size / 8) * 0.75}
      onClick={() => mino && setSelected(mino)}
      onHover={(hovered) => mino && setRelative(hovered ? (link as any) : null)}
    />
  )
}

// Hole for the octomino
function Hole() {
  const mino = useSelected()
  const { size, transform } = useMinoTransform()
  if (mino !== O_OCTOMINO) return null
  return (
    <Rect
      fill={colors.bg}
      coord={transform([1, 1])}
      width={size}
      height={size}
      stroke="none"
    />
  )
}

interface Props {
  showEditable?: boolean
}

/** The squares of the mino, highlighting parent squares */
function InnerSquares({ showEditable }: Props) {
  const mino = useSelected()
  const { fill, stroke } = getMinoColor(mino)

  return (
    <g>
      {[...getPossibleParents(mino)].map((link, i) => (
        <MinoSquare
          key={i}
          link={link}
          className={css`
            fill: ${!!link.mino && showEditable
              ? tinycolor.mix(fill, "white", 25).toString()
              : fill};
            stroke: ${stroke};
          `}
          selectedClassName={css`
            fill: ${tinycolor.mix(fill, "white", 80).toString()};
          `}
        />
      ))}
    </g>
  )
}

/** All neighbors that can be turned into children */
function OuterSquares() {
  const mino = useSelected()
  // Don't render if on the last generation
  if (getSize(mino) >= NUM_GENERATIONS) return null
  return (
    <g>
      {[...getChildren(mino)].map((link, i) => (
        <MinoSquare
          key={i}
          link={link}
          className={css`
            fill: ${colors.highlight};
            stroke: gray;
            opacity: 0;
          `}
          selectedClassName={css`
            opacity: 0.5;
          `}
        />
      ))}
    </g>
  )
}

/**
 * A mino that can have squares added or removed from it.
 */
export default function AdjustableMino({ showEditable }: Props) {
  return (
    <g>
      <Hole />
      <InnerSquares showEditable={showEditable} />
      <OuterSquares />
    </g>
  )
}
