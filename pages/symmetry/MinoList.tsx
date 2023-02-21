import { css } from "@emotion/react"
import { getMinoColor } from "components/graph"
import { Symmetry } from "mino"
import MinoLink from "components/MinoLink"
import { getMinosForSymmetry } from "./symmetryHelpers"
import SymmetryMarkers from "components/SymmetryMarkers"

export default function MinoList({ symmetry }: { symmetry: Symmetry }) {
  const minos = getMinosForSymmetry(symmetry)
  const minoSize = getMinoSize(symmetry)
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        gap: 1.75rem 1.75rem;
      `}
    >
      {minos.map((minos, gen) => {
        return (
          <div
            key={gen}
            css={css`
              display: flex;
              gap: 0.75rem;
            `}
          >
            {gen}
            <div
              css={css`
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 0.75rem;
                justify-content: space-between;

                ::after {
                  content: "";
                  flex: auto;
                }
              `}
            >
              {minos.map((mino) => {
                const { stroke, fill } = getMinoColor(mino)
                return (
                  <MinoLink
                    to={`/catalog/${mino.toString()}`}
                    key={mino.data}
                    mino={mino}
                    size={minoSize}
                    fill={fill}
                    stroke={stroke}
                    gridStyle="thin"
                  >
                    {
                      <SymmetryMarkers
                        mino={mino}
                        size={minoSize}
                        strokeWidth={2}
                        stroke={"white"}
                      />
                    }
                  </MinoLink>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getMinoSize(symmetry: Symmetry) {
  switch (symmetry) {
    case "all":
    case "rot2":
    case "diag2":
      return 13
    case "axis2":
    case "rot":
    case "diag":
      return 9
    case "axis":
      return 8
    case "none":
      return 7
  }
}
