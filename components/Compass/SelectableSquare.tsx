import { useAtom } from "jotai"
import { css, SerializedStyles } from "@emotion/react"
import Vector from "lib/vector"
import { PossibleRelativeLink } from "mino"
import { Rect } from "components/svg"
import { getAnchor } from "components/utils"
import { colors } from "style/theme"
import { relativeAtom, useSelected, useSetSelected } from "./compassHelpers"

function getBlockSize(gen: number) {
  return 125 / (gen + 4)
}

/** The transform and size of the current selected mino. */
function useMinoTransform() {
  const mino = useSelected()
  const size = getBlockSize(mino.order)
  const outline = mino.boundary().outline()
  const anchor = getAnchor(
    outline.map((v) => v.scale(size)),
    "center center",
  )

  const transform = (p: Vector) => p.scale(size).sub(anchor)
  return { size, transform }
}

interface SquareProps {
  defaultCss: SerializedStyles
  selectedCss: SerializedStyles
  link: PossibleRelativeLink
}

/** A single possibly selectable mino square */
export default function SelectableSquare({
  defaultCss,
  selectedCss,
  link,
}: SquareProps) {
  const { mino, coord } = link
  const [selected, setRelative] = useAtom(relativeAtom)
  const setSelected = useSetSelected()
  const { size, transform } = useMinoTransform()
  const isSelected = selected?.coord?.equals?.(coord)

  const selectableStyle = css`
    transition: all 150ms ease-in-out;
    transition-property: fill, opacity;
    cursor: pointer;
    pointer-events: initial;
  `

  // TODO (static css) change this to be static
  return (
    <Rect
      css={[!!mino && selectableStyle, defaultCss, isSelected && selectedCss]}
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
