import React from "react"

import { Mino } from "mino"

import Background from "./Background"
import PanZoom from "./PanZoom"
import FullScreenSvg from "./FullScreenSvg"
import GenerationRings from "./GenerationRings"
import MinoLinks from "./MinoLinks"

interface Props {
  // The currently selected mino
  selected?: Mino
  // Handler for selecting a mino
  onSelect?(mino?: Mino): void
}

/**
 * A graph showing the "family tree" of minos,
 * with edges connecting parent and child minos.
 */
export default function FamilyTree({ selected, onSelect }: Props) {
  return (
    <FullScreenSvg width={1100}>
      <Background onClick={() => onSelect?.(undefined)} />
      <PanZoom
        minZoom={0.25}
        maxZoom={2}
        zoomSpeed={0.075}
        smoothScroll={false}
      >
        <MinoLinks selected={selected} />
        <GenerationRings selected={selected} onSelect={onSelect} />
      </PanZoom>
    </FullScreenSvg>
  )
}
