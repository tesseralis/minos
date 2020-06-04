import React from "react"
import { css } from "emotion"
import { RelativeLink } from "mino"

import { useSelected } from "app/SelectedContext"
import CompassLinks from "./CompassLinks"
import Background from "./CompassBackground"
import AdjustableMino from "./AdjustableMino"
import SymmetryRing from "./SymmetryRing"
import { svgSize } from "./compassHelpers"

/**
 * Displays a mino and its direct children and parents.
 */
export default function Compass() {
  const selected = useSelected()
  // true if the inner symmetry ring has hover focus
  const [innerHovered, setInnerHovered] = React.useState(false)
  // the currently selected relative mino
  const [hovered, setHovered] = React.useState<RelativeLink | undefined>()

  if (!selected) return null

  return (
    <svg
      viewBox={`${-svgSize} ${-svgSize} ${svgSize * 2} ${svgSize * 2}`}
      className={css`
        width: 22rem;
        height: 22rem;
        pointer-events: none;
      `}
    >
      <Background />
      <CompassLinks hovered={hovered} onHover={setHovered} />
      <SymmetryRing onHover={setInnerHovered} />
      <AdjustableMino
        onHover={setHovered}
        hovered={hovered}
        showEditable={innerHovered}
      />
    </svg>
  )
}
