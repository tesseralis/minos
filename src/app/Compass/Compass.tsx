import React from "react"
import { css } from "emotion"
import { RelativeLink } from "mino"

import CompassLinks from "./CompassLinks"
import Background from "./CompassBackground"
import AdjustableMino from "./AdjustableMino"
import SymmetryRing from "./SymmetryRing"

const innerRadius = 50
const linkRadius = 90
const ringRadius = linkRadius + 30
const svgSize = ringRadius + 5
const halfRadius = (innerRadius + ringRadius) / 2

/**
 * Displays a mino and its direct children and parents.
 */
export default function Compass() {
  // true if the inner symmetry ring has hover focus
  const [innerHovered, setInnerHovered] = React.useState(false)
  // the currently selected relative mino
  const [hovered, setHovered] = React.useState<RelativeLink | undefined>()

  // FIXME don't render when there are no minos
  return (
    <svg
      viewBox={`${-svgSize} ${-svgSize} ${svgSize * 2} ${svgSize * 2}`}
      className={css`
        width: 22rem;
        height: 22rem;
        pointer-events: none;
      `}
    >
      <Background radius={ringRadius} innerRadius={halfRadius} />
      <CompassLinks
        hovered={hovered}
        radius={linkRadius}
        onHover={setHovered}
      />
      <SymmetryRing radius={innerRadius} onHover={setInnerHovered} />
      <AdjustableMino
        onHover={setHovered}
        hovered={hovered}
        showEditable={innerHovered}
      />
    </svg>
  )
}
