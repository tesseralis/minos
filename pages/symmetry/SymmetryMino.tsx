import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import MinoLink from "components/MinoLink"
import SymmetryMarkers from "components/SymmetryMarkers"
import { Polyomino } from "mino"

interface Props {
  mino: Polyomino
  size: number
}
export default function SymmetryMino({ mino, size }: Props) {
  const { stroke, fill } = getMinoColor(mino)
  return (
    <div
      css={css`
        svg {
          overflow: visible;
          /* transform: rotate(0)
          :hover {
            transform: rotate(-180deg);
            transition: transform 350ms ease-in-out;
          } */
      `}
    >
      <MinoLink
        to={`/catalog/${mino.toString()}`}
        mino={mino}
        size={size}
        fill={fill}
        stroke={stroke}
        gridStyle="thin"
      >
        {
          <SymmetryMarkers
            mino={mino}
            size={size}
            strokeWidth={2}
            stroke={"#ffffffaa"}
          />
        }
      </MinoLink>
    </div>
  )
}
