import { isEqual } from "lodash-es"
import { css } from "emotion"
import React from "react"
import tinycolor from "tinycolor2"

import {
  RelativeLink,
  PossibleRelativeLink,
  getSize,
  Coord,
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
  const gen = getSize(mino)
  const size = getBlockSize(gen)
  const minoPoints = [...getCoords(mino)]
  const outline = getOutline(minoPoints)
  const scale = ([x, y]: Point) => [x * size, y * size] as Point
  const scaledOutline = outline.map(scale)
  const [avgX, avgY] = getAnchor(scaledOutline, "center center")

  const translate = ([x, y]: Point) => [x - avgX, y - avgY] as Point

  const transform = (p: Point) => translate(scale(p))
  return { size, transform }
}

interface SquareProps {
  className: string
  link: PossibleRelativeLink
}

/**
 * A single possibly selectable mino square
 */
function MinoSquare({ className, link }: SquareProps) {
  const { mino, coord } = link
  const setSelected = useSetSelected()
  const setRelative = RelativeCtx.useSetValue()
  const { size, transform } = useMinoTransform()

  function hoverHandler(hovered: boolean) {
    if (!mino) return
    setRelative(hovered ? (link as RelativeLink) : null)
  }

  return (
    <Rect
      className={className}
      coord={transform(coord)}
      width={size}
      height={size}
      strokeWidth={(size / 8) * 0.75}
      onClick={() => mino && setSelected(mino)}
      onHover={hoverHandler}
    />
  )
}

// Hole for the octomino
function Hole() {
  const { size, transform } = useMinoTransform()
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

/**
 * A mino that can have squares added or removed from it.
 */
export default function AdjustableMino({ showEditable }: Props) {
  const mino = useSelected()
  const relative = RelativeCtx.useValue()

  const { fill, stroke } = getMinoColor(mino)
  const gen = getSize(mino)
  const showChildren = gen < NUM_GENERATIONS
  const showSquares = showEditable

  function isHovered(coord: Coord) {
    return isEqual(relative?.coord, coord)
  }

  return (
    <g>
      {mino === O_OCTOMINO && <Hole />}
      {/* Draw the neighboring points of the mino that can be clicked */}
      {showChildren &&
        [...getChildren(mino)].map((link, i) => {
          return (
            <MinoSquare
              key={i}
              link={link}
              className={css`
                transition: opacity 100ms ease-in-out;
                fill: ${colors.highlight};
                stroke: gray;
                cursor: pointer;
                pointer-events: initial;
                opacity: ${isHovered(link.coord) ? 0.5 : 0};
              `}
            />
          )
        })}
      {[...getPossibleParents(mino)].map((link, i) => {
        const { mino: parent, coord } = link
        // Make all removable points in the mino selectable
        // const parent = removeSquare(mino, point)
        return (
          <MinoSquare
            key={i}
            link={link}
            className={css`
              transition: fill 100ms ease-in-out;
              fill: ${fill};
              stroke: ${stroke};
              ${!!parent &&
              css`
                fill: ${isHovered(coord)
                  ? tinycolor.mix(fill, "white", 80).toString()
                  : showSquares
                  ? tinycolor.mix(fill, "white", 50).toString()
                  : fill};
                cursor: pointer;
                pointer-events: initial;
              `}
            `}
          />
        )
      })}
    </g>
  )
}
