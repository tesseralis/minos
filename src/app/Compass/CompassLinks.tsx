import React from "react"
import { scaleLinear } from "d3-scale"

import { Point, toCartesian } from "math"
import { Mino, RelativeLink, getSize } from "mino"

import { colors } from "style/theme"
import { getAngleScale, getArc } from "app/utils"
import {
  canonicalEquals,
  getSortedParents,
  getSortedChildren,
  getMinoColor,
  getLinkColor,
  MAX_NUM_CHILDREN,
  MAX_NUM_PARENTS,
} from "app/graph"

import SelectableMino from "app/SelectableMino"
import { RelativeCtx, linkRadius, useSelected } from "./compassHelpers"

function getSpread(maxSpread: number, count: number) {
  return maxSpread * ((count - 1) / count)
}

function getBlockSize(gen: number) {
  return 25 / (gen + 4)
}

interface StrandProps {
  // the relative mino represented by this strand
  link: RelativeLink
  // color of the link
  linkColor: string
  // block size of the relative mino
  size: number
  // x and y coordinates of the relative mino
  coord: Point
}

/**
 * A link to a parent or child mino
 */
function Strand({ link, linkColor, coord, size }: StrandProps) {
  const selectedLink = RelativeCtx.useValue()
  const setSelectedLink = RelativeCtx.useSetValue()
  const isSelected =
    !!selectedLink && canonicalEquals(selectedLink.mino, link.mino)
  const linkPath = getArc(coord, [0, 0], [0, -linkRadius * 2])
  const { fill, stroke } = getMinoColor(link.mino)
  return (
    <g>
      <path
        stroke={isSelected ? colors.highlight : linkColor}
        strokeWidth={isSelected ? 2 : 1}
        d={linkPath}
        fill="none"
        opacity={0.5}
      />
      <SelectableMino
        mino={isSelected ? selectedLink!.mino : link.mino}
        onHover={(mino) => setSelectedLink(mino ? link : null)}
        stroke={isSelected ? colors.highlight : stroke}
        coord={coord}
        size={size}
        fill={fill}
      />
    </g>
  )
}

interface StrandsProps {
  // The set of minos to render as strands
  links: RelativeLink[]
  // The maximum number of minos that can be rendered
  maxNumMinos: number
  // The maximum and minimum amount to scale up each mino
  scaleRange: [number, number]
  // The maximum angle (in turns) that the minos can be fanned out
  maxSpread: number
  // The angle (in turns) to start the spread
  spreadStart: number
  // Whether to reverse the order of minos
  reverse?: boolean
  // Function to determine the color of the link
  linkColor(mino: Mino): string
}

/**
 * Links to a set of minos (e.g. the parents or children)
 */
function Strands({
  links,
  maxNumMinos,
  scaleRange,
  maxSpread,
  spreadStart,
  reverse,
  linkColor,
  ...props
}: StrandsProps) {
  const gen = getSize(links[0]?.mino)
  const numMinos = links.length
  // Scale up each mino based on how many minos there are.
  // The less minos compared to the max possible, the larger the scaling
  const sizeScale = scaleLinear().domain([1, maxNumMinos]).range(scaleRange)
  const scaledSize = getBlockSize(gen) * sizeScale(numMinos)
  // Scale up the radius so that the more minos there are,
  // the further away from the center
  const scaledRadius = linkRadius + numMinos * 1.25
  const getAngle = getAngleScale({
    spread: getSpread(maxSpread, numMinos),
    start: spreadStart,
    count: numMinos,
    reverse,
  })
  return (
    <g>
      {[...links].map((link, i) => {
        return (
          <Strand
            {...props}
            key={link.mino}
            link={link}
            linkColor={linkColor(link.mino)}
            size={scaledSize}
            coord={toCartesian({
              radius: scaledRadius,
              angle: getAngle(i),
            })}
          />
        )
      })}
    </g>
  )
}

export default function CompassLinks() {
  const mino = useSelected()
  return (
    <g>
      <Strands
        links={getSortedParents(mino)}
        maxNumMinos={MAX_NUM_PARENTS}
        scaleRange={[4, 2]}
        maxSpread={1 / 3}
        spreadStart={-1 / 4}
        linkColor={(parent: Mino) => getLinkColor(parent, mino)}
      />
      <Strands
        links={getSortedChildren(mino)}
        maxNumMinos={MAX_NUM_CHILDREN}
        scaleRange={[3, 1]}
        maxSpread={15 / 32}
        spreadStart={1 / 4}
        reverse
        linkColor={(child: Mino) => getLinkColor(mino, child)}
      />
    </g>
  )
}
