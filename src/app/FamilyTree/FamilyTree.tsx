import React from "react"

import Background from "./Background"
import PanZoom from "./PanZoom"
import FullScreenSvg from "./FullScreenSvg"
import GenerationRings from "./GenerationRings"
import MinoLinks from "./MinoLinks"

/**
 * A graph showing the "family tree" of minos,
 * with edges connecting parent and child minos.
 */
export default function FamilyTree() {
  return (
    <FullScreenSvg width={1100}>
      <Background />
      <PanZoom
        minZoom={0.25}
        maxZoom={2}
        zoomSpeed={0.075}
        smoothScroll={false}
      >
        <MinoLinks />
        <GenerationRings />
      </PanZoom>
    </FullScreenSvg>
  )
}
