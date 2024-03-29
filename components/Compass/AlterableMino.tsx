import { css } from "@emotion/react"
import tinycolor from "tinycolor2"

import { O_OCTOMINO } from "mino"
import { NUM_GENERATIONS, getMinoColor } from "components/graph"
import { colors } from "style/theme"
import { useSelected } from "./compassHelpers"
import MinoSquare, { Hole } from "./SelectableSquare"

interface Props {
  highlight?: boolean
}

// TODO (static css) change this to be static
/** The squares of the mino, highlighting parent squares */
function InnerSquares({ highlight }: Props) {
  const mino = useSelected()
  const { fill, stroke } = getMinoColor(mino)

  return (
    <g key={mino.data}>
      {mino.equals(O_OCTOMINO) && <Hole />}
      {mino.relatives.possibleParents().map((link, i) => (
        <MinoSquare
          key={i}
          link={link as any}
          defaultCss={css`
            fill: ${!!link.mino && highlight
              ? tinycolor.mix(fill, "white", 25).toString()
              : fill};
            stroke: ${stroke};
          `}
          selectedCss={css`
            fill: ${tinycolor.mix(fill, "white", 80).toString()};
          `}
        />
      ))}
    </g>
  )
}

/** All neighbors that can be turned into children */
function OuterSquares() {
  const mino = useSelected()
  // Don't render if on the last generation
  if (mino.order >= NUM_GENERATIONS) return null
  return (
    <g key={mino.data}>
      {mino.relatives.enumerateChildren().map((link, i) => (
        <MinoSquare
          key={i}
          link={link}
          defaultCss={css`
            fill: ${colors.highlight};
            stroke: gray;
            opacity: 0;

            @media (hover: none) {
              fill: ${colors.bg};
              stroke: grey;
              opacity: 0.25;
            }
          `}
          selectedCss={css`
            opacity: 0.5;
          `}
        />
      ))}
    </g>
  )
}

/**
 * A mino that can have squares added or removed from it.
 */
export default function AlterableMino({ highlight }: Props) {
  return (
    <g>
      <InnerSquares highlight={highlight} />
      <OuterSquares />
    </g>
  )
}
