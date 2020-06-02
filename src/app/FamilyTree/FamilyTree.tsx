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

export default function MinoGraph({ selected, onSelect }: Props) {
  return (
    <FullScreenSvg width={1400}>
      <Background onClick={() => onSelect?.(undefined)} />
      <PanZoom minZoom={0.125} maxZoom={2} zoomSpeed={0.075}>
        <MinoLinks selected={selected} />
        <GenerationRings selected={selected} onSelect={onSelect} />
      </PanZoom>
    </FullScreenSvg>
  )
}
