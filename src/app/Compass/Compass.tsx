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
  // true if the inner symmetry ring has hover focus
  const [showEditable, setShowEditable] = React.useState(false)
  // the currently selected relative mino
  const [hovered, setHovered] = React.useState<RelativeLink | undefined>()

  // Don't render the compass if there is no mino selected
  const selected = useSelected()
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
      <SymmetryRing onHover={setShowEditable} />
      <AdjustableMino
        onHover={setHovered}
        hovered={hovered}
        showEditable={showEditable}
      />
    </svg>
  )
}
