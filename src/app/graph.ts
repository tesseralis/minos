import tinycolor from "tinycolor2"

import { generateGraph } from "mino/generate"
import type { Mino } from "mino/mino"

export const numGenerations = 8
const { nodes, links, meta } = generateGraph(numGenerations)

// Cached colors of each link
const linkColors: Record<number, Record<number, string>> = {}
for (const [src, tgt] of links) {
  linkColors[src] = linkColors[src] ?? {}
  linkColors[src][tgt] = tinycolor
    .mix(meta[src].color!, meta[tgt].color!)
    .toHexString()
}

export { nodes, links }

export function getParents(mino: Mino) {
  return meta[mino].parents
}

export function getChildren(mino: Mino) {
  return meta[mino].children
}

/** Get the fill color of the given mino */
function getMinoFill(mino: Mino) {
  return meta[mino].color!.toString()
}

/** Get the stroke color of the given mino */
function getMinoStroke(mino: Mino) {
  return meta[mino].borderColor!
}

/**
 * Return the fill and stroke of the given mino to pass in as SVG props:
 *
 * <MinoSvg {...getMinoColor(mino)} />
 */
export function getMinoColor(mino: Mino) {
  return {
    fill: getMinoFill(mino),
    stroke: getMinoStroke(mino),
  }
}

/**
 * Return the stroke color of the link between the given pair of minos
 */

export function getLinkColor(src: Mino, tgt: Mino) {
  const color = linkColors[src]?.[tgt]
  if (!color) throw new Error(`Invalid mino pair given`)
  return color
}
