import { useState } from "react"
import { css } from "@emotion/react"

import { Polyomino } from "mino"
import { G } from "components/svg"
import CompassLinks from "./CompassLinks"
import Background from "./CompassBackground"
import AlterableMino from "./AlterableMino"
import SymmetryRing from "./SymmetryRing"
import { SelectedContextProvider, svgSize } from "./compassHelpers"

interface Props {
  selected: Polyomino
  onSelect(mino: Polyomino): void
}

/**
 * Displays a mino and its direct children and parents.
 */
export default function Compass({ selected, onSelect }: Props) {
  // true if the inner symmetry ring has hover focus
  const [showEditable, setShowEditable] = useState(false)
  const [showTransforms, setShowTransforms] = useState(false)

  return (
    <SelectedContextProvider selected={selected} setSelected={onSelect}>
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
    </SelectedContextProvider>
  )
}
