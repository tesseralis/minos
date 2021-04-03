import React from "react"
import { css } from "@emotion/css"

import { G } from "app/svg"
import { useSelected } from "app/SelectedContext"
import CompassLinks from "./CompassLinks"
import Background from "./CompassBackground"
import AlterableMino from "./AlterableMino"
import SymmetryRing from "./SymmetryRing"
import { RelativeCtx, svgSize } from "./compassHelpers"

/**
 * Displays a mino and its direct children and parents.
 */
export default function Compass() {
  // true if the inner symmetry ring has hover focus
  const [showEditable, setShowEditable] = React.useState(false)
  const [showTransforms, setShowTransforms] = React.useState(false)

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
        <G onHover={setShowTransforms}>
          <Background />
          <CompassLinks />
          <G onHover={setShowEditable}>
            <SymmetryRing showTransforms={showTransforms} />
            <AlterableMino highlight={showEditable} />
          </G>
        </G>
      </svg>
    </RelativeCtx.Provider>
  )
}
