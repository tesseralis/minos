import React from "react"
import { css } from "@emotion/css"

import Background from "./Background"
import PanZoom from "./PanZoom"
import FullScreenSvg from "./FullScreenSvg"
import GenerationRings from "./GenerationRings"
import MinoLinks from "./MinoLinks"
import SelectedContext from "app/SelectedContext"
import Compass from "app/Compass"

/**
 * A graph showing the "family tree" of minos,
 * with edges connecting parent and child minos.
 */
export default function FamilyTree() {
  return (
    <SelectedContext.Provider>
      <div>
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
        <div
          className={css`
            position: absolute;
            top: 0;
            right: 0;
            pointer-events: none;
          `}
        >
          <Compass />
        </div>
      </div>
    </SelectedContext.Provider>
  )
}
