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

export { nodes, links, meta, linkColors }

/** Get the fill color of the given mino */
export function getMinoFill(mino: Mino) {
  return meta[mino].color!.toString()
}

/** Get the stroke color of the given mino */
export function getMinoStroke(mino: Mino) {
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
