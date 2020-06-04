import { isEqual } from "lodash-es"
import { css } from "emotion"
import React from "react"
import tinycolor from "tinycolor2"

import {
  Mino,
  getSize,
  Coord,
  RelativeLink,
  getCoords,
  getChildren,
  getPossibleParents,
  getOutline,
  O_OCTOMINO,
} from "mino"
import { NUM_GENERATIONS, getMinoColor } from "app/graph"
import { Point, Rect } from "app/svg"
import { getAnchor } from "app/utils"
import { useSelected, useSetSelected } from "app/SelectedContext"
import { colors } from "style/theme"

function getBlockSize(gen: number) {
  return 125 / (gen + 4)
}

interface Props {
  showEditable?: boolean
  hovered?: RelativeLink
  onHover?(link?: RelativeLink): void
}

// TODO There's some logic duplicated here from `MinoSvg`.

/**
 * Renders a mino that can have squares added or removed from it.
 */
export default function AdjustableMino({
  showEditable,
  hovered,
  onHover,
}: Props) {
  const [innerHovered, setInnerHovered] = React.useState(false)
  const mino = useSelected()
  const setSelected = useSetSelected()
  if (!mino) return null

  const { fill, stroke } = getMinoColor(mino)
  const gen = getSize(mino)
  const showChildren = gen < NUM_GENERATIONS
  const blockSize = getBlockSize(gen)
  const showSquares = showEditable || innerHovered

  function hoverHandler(mino: Mino | undefined, coord: Coord) {
    return (hovered: boolean) => {
      if (!mino) return
      onHover?.(hovered ? { mino, coord } : undefined)
      setInnerHovered(hovered)
    }
  }

  function isHovered(coord: Coord) {
    return isEqual(hovered?.coord, coord)
  }

  const strokeWidth = blockSize / 8
  const minoPoints = [...getCoords(mino)]
  const outline = getOutline(minoPoints)
  const scale = ([x, y]: Point) => [x * blockSize, y * blockSize] as Point
  const scaledOutline = outline.map(scale)
  const [avgX, avgY] = getAnchor(scaledOutline, "center center")

  const translate = ([x, y]: Point) => [x - avgX, y - avgY] as Point

  return (
    <g>
      {mino === O_OCTOMINO && (
        <Rect
          fill={colors.bg}
          coord={translate(scale([1, 1]))}
          width={blockSize}
          height={blockSize}
          stroke="none"
        />
      )}
      {/* Draw the neighboring points of the mino that can be clicked */}
      {showChildren &&
        [...getChildren(mino)].map(({ mino: child, coord }, i) => {
          return (
            <Rect
              className={css`
                cursor: pointer;
                pointer-events: initial;
                opacity: ${isHovered(coord) ? 0.5 : 0};
              `}
              key={i}
              coord={translate(scale(coord))}
              width={blockSize}
              height={blockSize}
              fill={colors.highlight}
              stroke="gray"
              strokeWidth={strokeWidth * 0.75}
              onClick={() => setSelected(child)}
              onHover={hoverHandler(child, coord)}
            />
          )
        })}
      {[...getPossibleParents(mino)].map(({ mino: parent, coord }, i) => {
        // Make all removable points in the mino selectable
        // const parent = removeSquare(mino, point)
        return (
          <Rect
            className={css`
              fill: ${fill};
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
            style={{ stroke }}
            key={i}
            coord={translate(scale(coord))}
            width={blockSize}
            height={blockSize}
            strokeWidth={strokeWidth * 0.75}
            onClick={() => !!parent && setSelected(parent)}
            onHover={hoverHandler(parent, coord)}
          />
        )
      })}
    </g>
  )
}
