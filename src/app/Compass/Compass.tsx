import React from "react"
import { css } from "emotion"

import { useSelected } from "app/SelectedContext"
import CompassLinks from "./CompassLinks"
import Background from "./CompassBackground"
import AdjustableMino from "./AdjustableMino"
import SymmetryRing from "./SymmetryRing"
import { RelativeCtx, svgSize } from "./compassHelpers"

/**
 * Displays a mino and its direct children and parents.
 */
export default function Compass() {
  // true if the inner symmetry ring has hover focus
  const [showEditable, setShowEditable] = React.useState(false)

  // Don't render the compass if there is no mino selected
  const selected = useSelected()
  if (!selected) return null

  return (
    <RelativeCtx.Provider>
      <svg
        viewBox={`${-svgSize} ${-svgSize} ${svgSize * 2} ${svgSize * 2}`}
        className={css`
          width: 22rem;
          height: 22rem;
          pointer-events: none;
        `}
      >
        <Background />
        <CompassLinks />
        <SymmetryRing onHover={setShowEditable} />
        <AdjustableMino showEditable={showEditable} />
      </svg>
    </RelativeCtx.Provider>
  )
}
