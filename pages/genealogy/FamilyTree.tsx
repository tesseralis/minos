import { css } from "@emotion/react"

import Background from "./Background"
import PanZoom from "./PanZoom"
import FullScreenSvg from "./FullScreenSvg"
import GenerationRings from "./GenerationRings"
import MinoLinks from "./MinoLinks"
import SelectedContext from "components/SelectedContext"
import Compass from "components/Compass"
import Nav from "components/Nav"

/**
 * A graph showing the "family tree" of minos,
 * with edges connecting parent and child minos.
 */
export default function FamilyTree() {
  return (
    <SelectedContext.Provider>
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        `}
      >
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
          css={css`
            position: absolute;
            top: 0;
            left: 0;

            margin-left: 2rem;
            margin-top: 2rem;
          `}
        >
          <Nav />
        </div>
        <div
          css={css`
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
