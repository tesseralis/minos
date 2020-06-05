import React, { memo } from "react"
import { css, cx, keyframes } from "emotion"

import { Mino, getSize } from "mino"
import { colors } from "style/theme"

import { getArc } from "app/utils"
import { links, getCanonical, getLinkColor, getIndex } from "app/graph"
import transition from "app/transition"
import { START_GENS, ringRadius, getCoords } from "./treeHelpers"
import { useSelected } from "app/SelectedContext"

/**
 * Return the path for the link that goes from the source to target mino.
 * The link is a circular that intersects both points as well as a third point
 * scaled according to the radius of the generation.
 */
function getLinkPath([srcMino, tgtMino]: [Mino, Mino]) {
  const gen = getSize(srcMino)
  const origin = [0, -1 - ringRadius(gen) * 0.75] as const
  const src = getCoords(gen, getIndex(srcMino))
  const tgt = getCoords(gen + 1, getIndex(tgtMino))

  return getArc(src, tgt, origin)
}

interface MinoLinkProps {
  link: [Mino, Mino]
  isSelected: boolean
}

const MinoLink = memo(({ link, isSelected }: MinoLinkProps) => {
  const [srcMino, tgtMino] = link
  const gen = getSize(srcMino)
  const strokeWidth = 4 / ((gen - 1) / 2 + 1) ** 2

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
      className={cx(base, gen >= START_GENS && fadeAnimation)}
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
  const startIndex = links.findIndex(([src]) => getSize(src) >= START_GENS)
  const [visIndex, setVisIndex] = React.useState(startIndex)
  // TODO make this more sophisticated and sync up with the other animation
  React.useEffect(() => {
    transition({
      duration: 4000,
      onUpdate(val) {
        setVisIndex(startIndex + val * (links.length - startIndex))
      },
    })
  }, [startIndex])

  return (
    <g>
      {links.map(
        (link, i) =>
          i < visIndex && (
            <MinoLink
              key={i}
              link={link}
              isSelected={!!selected && link.includes(getCanonical(selected))}
            />
          ),
      )}
    </g>
  )
})
