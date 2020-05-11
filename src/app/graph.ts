import tinycolor from "tinycolor2"
import { generateGraph } from "mino/generate"

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
