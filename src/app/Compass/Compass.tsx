import React from "react"
import { css } from "emotion"
import { Mino, RelativeLink, getSize } from "mino"

import { getMinoColor, NUM_GENERATIONS } from "app/graph"

import CompassLinks from "./CompassLinks"
import Background from "./CompassBackground"
import AdjustableMino from "./AdjustableMino"
import SymmetryRing from "./SymmetryRing"

function getBlockSize(gen: number) {
  return 25 / (gen + 4)
}

interface Props {
  mino: Mino
  onSelect?(mino: Mino): void
}

const innerRadius = 40
const linkRadius = 90
const ringRadius = linkRadius + 30
const svgSize = ringRadius + 5
const halfRadius = (innerRadius + ringRadius) / 2

/**
 * Displays a mino and its direct children and parents.
 */
export default function Compass({ mino, onSelect }: Props) {
  // true if the inner symmetry ring has hover focus
  const [innerHovered, setInnerHovered] = React.useState(false)
  // the currently selected relative mino
  const [hovered, setHovered] = React.useState<RelativeLink | undefined>()

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
        mino={mino}
        hovered={hovered}
        radius={linkRadius}
        onHover={setHovered}
        onSelect={onSelect}
      />
      <SymmetryRing
        mino={mino}
        radius={innerRadius}
        onHover={setInnerHovered}
        onSelect={onSelect}
      />
      <AdjustableMino
        mino={mino}
        cx={0}
        cy={0}
        size={getBlockSize(getSize(mino)) * 5}
        onHover={setHovered}
        hovered={hovered}
        onSelect={onSelect}
        showEditable={innerHovered}
        showChildren={getSize(mino) === NUM_GENERATIONS}
        {...getMinoColor(mino)}
      />
    </svg>
  )
}
