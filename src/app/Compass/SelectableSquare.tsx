import { cx, css } from "@emotion/css"
import React from "react"

import Vector from "vector"
import { PossibleRelativeLink } from "mino"
import { Rect } from "app/svg"
import { getAnchor } from "app/utils"
import { useSetSelected } from "app/SelectedContext"
import { colors } from "style/theme"
import { RelativeCtx, useSelected } from "./compassHelpers"

function getBlockSize(gen: number) {
  return 125 / (gen + 4)
}

/** The transform and size of the current selected mino. */
function useMinoTransform() {
  const mino = useSelected()
  const size = getBlockSize(mino.order)
  const outline = mino.outline()
  const anchor = getAnchor(
    outline.map((v) => v.scale(size)),
    "center center",
  )

  const transform = (p: Vector) => p.scale(size).sub(anchor)
  return { size, transform }
}

interface SquareProps {
  className: string
  selectedClassName: string
  link: PossibleRelativeLink
}

/** A single possibly selectable mino square */
export default function SelectableSquare({
  className,
  selectedClassName,
  link,
}: SquareProps) {
  const { mino, coord } = link
  const setSelected = useSetSelected()
  const setRelative = RelativeCtx.useSetValue()
  const { size, transform } = useMinoTransform()
  const selected = RelativeCtx.useValue()
  const isSelected = selected?.coord?.equals?.(coord)

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
export function Hole() {
  const { size, transform } = useMinoTransform()
  return (
    <Rect
      fill={colors.bg}
      coord={transform(new Vector(1, 1))}
      width={size}
      height={size}
      stroke="none"
    />
  )
}
