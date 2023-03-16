import { css } from "@emotion/react"

import Background from "./Background"
import PanZoom from "./PanZoom"
import FullScreenSvg from "./FullScreenSvg"
import GenerationRings from "./GenerationRings"
import MinoLinks from "./MinoLinks"
import Compass from "components/Compass"
import Nav from "components/Nav"
import { useSelected, useSetSelected } from "components/SelectedContext"
import { media } from "style/media"

/**
 * A graph showing the "family tree" of minos,
 * with edges connecting parent and child minos.
 */
export default function FamilyTree() {
  const selected = useSelected()
  const setSelected = useSetSelected()
  return (
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
          @media ${media.lg} {
            top: 2rem;
          }
        `}
      >
        <Nav />
      </div>
      <div
        css={css`
          position: absolute;
          top: 50%;
          right: 50%;
          transform: translate(50%, -50%);
          pointer-events: none;

          @media ${media.sm} {
            top: 0;
            right: 0;
            transform: initial;
          }
        `}
      >
        {selected && <Compass selected={selected} onSelect={setSelected} />}
      </div>
    </div>
  )
}
