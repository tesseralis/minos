import { css } from "emotion"
import React from "react"
import tinycolor from "tinycolor2"

import { O_OCTOMINO } from "mino"
import { NUM_GENERATIONS, getMinoColor } from "app/graph"
import { colors } from "style/theme"
import { useSelected } from "./compassHelpers"
import MinoSquare, { Hole } from "./SelectableSquare"

interface Props {
  highlight?: boolean
}

/** The squares of the mino, highlighting parent squares */
function InnerSquares({ highlight }: Props) {
  const mino = useSelected()
  const { fill, stroke } = getMinoColor(mino)

  return (
    <g>
      {mino.data === O_OCTOMINO && <Hole />}
      {mino.possibleParents().map((link, i) => (
        <MinoSquare
          key={i}
          link={link as any}
          className={css`
            fill: ${!!link.mino && highlight
              ? tinycolor.mix(fill, "white", 25).toString()
              : fill};
            stroke: ${stroke};
          `}
          selectedClassName={css`
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
    <g>
      {mino.enumerateChildren().map((link, i) => (
        <MinoSquare
          key={i}
          link={link}
          className={css`
            fill: ${colors.highlight};
            stroke: gray;
            opacity: 0;
          `}
          selectedClassName={css`
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
