import { useState } from "react"
import { css } from "@emotion/react"

import { G } from "components/svg"
import { useSelected } from "components/SelectedContext"
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
  const [showEditable, setShowEditable] = useState(false)
  const [showTransforms, setShowTransforms] = useState(false)

  // Don't render the compass if there is no mino selected
  const selected = useSelected()
  if (!selected) return null

  return (
    <RelativeCtx.Provider>
      <svg
        viewBox={`${-svgSize} ${-svgSize} ${svgSize * 2} ${svgSize * 2}`}
        css={css`
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
