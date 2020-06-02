import React, { memo } from "react"
import { css } from "emotion"

import { Mino, getSize } from "mino"
import { colors } from "style/theme"
import { getArc } from "app/utils"
import { links, getLinkColor, getIndex } from "app/graph"

import { ringRadius, getCoords } from "./treeHelpers"

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
  return (
    <path
      className={css`
        transition: all 250ms ${isSelected ? "ease-out" : "ease-in"};
        pointer-events: none;
      `}
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
  return (
    <g>
      {links.map((link, i) => (
        <MinoLink
          key={i}
          link={link}
          isSelected={(link as any[]).includes(selected)}
        />
      ))}
    </g>
  )
})
