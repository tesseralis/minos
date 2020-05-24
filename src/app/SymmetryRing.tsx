import React from "react"
import { css } from "emotion"
import tinycolor from "tinycolor2"

import type { Mino } from "mino/mino"
import { getSymmetry } from "mino/transform"
import { getSymmetryColor } from "./graph"

interface Props {
  mino: Mino
  radius: number
  onHover?(hovered: boolean): void
}

/**
 * Displays the symmetry of the mino
 */
export default function SymmetryRing({ mino, radius, onHover }: Props) {
  const symmetry = getSymmetry(mino)
  const color = getSymmetryColor(symmetry)
  return (
    <circle
      cx={0}
      cy={0}
      r={radius}
      fill={tinycolor(color).setAlpha(0.25).toString()}
      stroke={color}
      strokeWidth={2}
      opacity={1 / 2}
      className={css`
        pointer-events: initial;
      `}
      onMouseOver={() => onHover?.(true)}
      onMouseOut={() => onHover?.(false)}
    />
  )
}
