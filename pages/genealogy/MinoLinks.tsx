import { memo, useState, useEffect } from "react"
import { css, keyframes } from "@emotion/react"

import Vector from "lib/vector"
import { Polyomino } from "mino"
import { colors } from "style/theme"

import { getArc } from "components/utils"
import { links, getLinkColor } from "components/graph"
import transition from "components/transition"
import { START_GENS, ringRadius, getCoords } from "./treeHelpers"
import { useSelected } from "components/SelectedContext"

/**
 * Return the path for the link that goes from the source to target mino.
 * The link is a circular that intersects both points as well as a third point
 * scaled according to the radius of the generation.
 */
function getLinkPath([srcMino, tgtMino]: [Polyomino, Polyomino]) {
  const origin = new Vector(0, -1 - ringRadius(srcMino.order) * 0.75)
  return getArc(getCoords(srcMino), getCoords(tgtMino), origin)
}

interface MinoLinkProps {
  link: [Polyomino, Polyomino]
  isSelected: boolean
}

const MinoLink = memo(({ link, isSelected }: MinoLinkProps) => {
  const [srcMino, tgtMino] = link
  const gen = srcMino.order
  const strokeWidth = 4 / ((gen - 1) / 2 + 1) ** 2

  // TODO (static css) change out keyframes and change the isSelected
  const base = css`
    transition: all 250ms ${isSelected ? "ease-out" : "ease-in"};
    pointer-events: none;
  `

  const fadeIn = keyframes`
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  `

  const fadeAnimation = css`
    animation: ${fadeIn} 500ms;
  `
  return (
    <path
      css={[base, gen >= START_GENS && fadeAnimation]}
      style={{
        stroke: isSelected ? colors.highlight : getLinkColor(srcMino, tgtMino),
        strokeWidth: strokeWidth * (isSelected ? 3 : 1),
      }}
      d={getLinkPath(link)}
      fill="none"
    />
  )
})

/**
 * The strands connecting related minos.
 */
export default memo(function MinoLinks() {
  const selected = useSelected()
  const startIndex = links.findIndex(([src]) => src.order >= START_GENS)
  const [visIndex, setVisIndex] = useState(startIndex)
  // TODO make this more sophisticated and sync up with the other animation
  useEffect(() => {
    const trans = transition({
      duration: 4000,
      onUpdate(val) {
        setVisIndex(startIndex + val * (links.length - startIndex))
      },
    })
    return () => trans.cancel()
  }, [startIndex])

  return (
    <g>
      {links.map(
        (link, i) =>
          i < visIndex && (
            <MinoLink
              key={i}
              link={link}
              isSelected={
                !!selected && link.includes(selected.transform.free())
              }
            />
          ),
      )}
    </g>
  )
})
