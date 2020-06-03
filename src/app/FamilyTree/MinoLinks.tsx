import React, { memo } from "react"
import { css, cx, keyframes } from "emotion"

import { Mino, getSize } from "mino"
import { colors } from "style/theme"
import { getArc } from "app/utils"
import { links, getLinkColor, getIndex } from "app/graph"

import { START_GENS, ringRadius, getCoords } from "./treeHelpers"

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

interface Props {
  selected?: Mino
}

/**
 * The strands connecting related minos.
 */
export default memo(function MinoLinks({ selected }: Props) {
  const startIndex = links.findIndex(([src]) => getSize(src) >= START_GENS)
  const [visIndex, setVisIndex] = React.useState(startIndex)
  // FIXME do requestAnimationFrame instead
  React.useEffect(() => {
    setInterval(() => {
      setVisIndex((visIndex) => visIndex + 50)
    }, 1 / 60)
  }, [])

  return (
    <g>
      {links.map(
        (link, i) =>
          i < visIndex && (
            <MinoLink
              key={i}
              link={link}
              isSelected={!!selected && link.includes(selected)}
            />
          ),
      )}
    </g>
  )
})
