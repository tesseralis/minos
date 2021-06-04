import tinycolor from "tinycolor2"
import { uniqBy, sortBy, mapValues } from "lodash"
import { scaleLinear } from "d3-scale"

import { Polyomino, RelativeLink, MinoClass, Symmetry, MONOMINO } from "mino"

type Color = tinycolor.Instance
type MinoData = number

export const baseColorMap: Record<Symmetry, string> = {
  none: "#aaa",
  axis: "#e22",
  diag: "#66f",
  rot: "limegreen",
  axis2: "gold",
  diag2: "turquoise",
  rot2: "violet",
  all: "#dee",
}

const classColorMap: Record<MinoClass, string> = {
  rectangle: "#ccc",
  "Ferrers graph": "#33dddd",
  staircase: "#4488ff",
  stack: "#4d2",
  "directed convex": "#8844ff",
  "bar graph": "#ffcc33",
  convex: "#d2d",
  "directed semiconvex": "#ff6600",
  semiconvex: "red",
  directed: "brown",
  other: "grey",
}

export function getSymmetryColor(symmetry: Symmetry): string {
  return baseColorMap[symmetry]
}

function getNoise(mino: Polyomino) {
  const data = mino.transform.free().data
  const hex = data.toString(16).padStart(6, "0")
  return tinycolor(hex)
}

function getBorderColor(color: Color) {
  return color.darken(50).desaturate(40).spin(-30)
}

const colorMap: Record<MinoClass, Color> = mapValues(classColorMap, (col) =>
  tinycolor(col).desaturate(30),
)

function sum(nums: number[]) {
  return nums.reduce((s, n) => s + n, 0)
}

function avg(nums: number[]) {
  return sum(nums) / nums.length
}

function getParentKey(mino: Polyomino, indices: Record<MinoData, number>) {
  return avg([...mino.relatives.freeParents()].map((p) => indices[p.data]))
}

/**
 * Sort the list of minos by the average of their parents' indices
 */
function sortByParents(minos: Polyomino[], indices: Record<MinoData, number>) {
  return sortBy(minos, (mino) => getParentKey(mino, indices))
}

export function generateGraph(n: number) {
  const nodes: Polyomino[][] = []
  const links: [Polyomino, Polyomino][] = []

  // mapping from each mino to its index in the generation
  const indices: Record<MinoData, number> = {
    [MONOMINO.data]: 0,
  }
  const visited = new Set<MinoData>([MONOMINO.data])
  let currentGen = [MONOMINO]

  // TODO don't need to iterate over children of last generation
  while (nodes.length < n - 1) {
    const nextGen = []
    for (const mino of currentGen) {
      for (const child of mino.relatives.freeChildren()) {
        if (!visited.has(child.data)) {
          nextGen.push(child)
          visited.add(child.data)
        }
        links.push([mino, child])
      }
    }

    nodes.push(currentGen)
    currentGen = sortByParents(nextGen, indices)
    currentGen.forEach((mino, i) => {
      indices[mino.data] = i
    })
  }
  nodes.push(currentGen)

  // Generate mino colors
  const colors: Record<MinoData, Color> = {}
  for (const generation of nodes) {
    for (const mino of generation) {
      const minoClass = mino.classes.best()
      if (mino.equals(MONOMINO)) {
        colors[mino.data] = colorMap[minoClass]
        continue
      }
      const mixedColor = tinycolor.mix(
        colorMap[minoClass],
        tinycolor.random(),
        20,
      )
      colors[mino.data] = mixedColor
    }
  }

  return { nodes, links, colors, indices }
}

export const NUM_GENERATIONS = 8
const { nodes, links, colors, indices } = generateGraph(NUM_GENERATIONS)

const allMinos = nodes.flat()

export const MAX_NUM_PARENTS = Math.max(
  ...allMinos.map((mino) => mino.relatives.freeParents().size),
)
export const MAX_NUM_CHILDREN = Math.max(
  ...allMinos.map((mino) => mino.relatives.freeChildren().size),
)

// Cached colors of each link
const linkColors: Record<number, Record<number, string>> = {}
for (const [src, tgt] of links) {
  linkColors[src.data] = linkColors[src.data] ?? {}
  linkColors[src.data][tgt.data] = tinycolor
    .mix(colors[src.data], colors[tgt.data])
    .toHexString()
}

export { nodes, links }

function getUniqSorted(minos: RelativeLink[]): RelativeLink[] {
  const uniq = uniqBy([...minos], ({ mino }) => mino.transform.free())
  return sortBy(uniq, ({ mino }) => getIndex(mino))
}

/**
 * Get the parents of the mino sorted by their indices in the graph
 */
export function getSortedParents(mino: Polyomino): RelativeLink[] {
  return getUniqSorted(mino.relatives.enumerateParents())
}

/**
 * Get the children of the mino sorted by their indices in the graph
 */
export function getSortedChildren(mino: Polyomino): RelativeLink[] {
  if (mino.order === NUM_GENERATIONS) return []
  return getUniqSorted(mino.relatives.enumerateChildren())
}

/**
 * Get the index of the mino within its generation
 */
export function getIndex(mino: Polyomino) {
  return indices[mino.transform.free().data]
}

/**
 * Return the fill and stroke of the given mino to pass in as SVG props:
 *
 * <MinoSvg {...getMinoColor(mino)} />
 */
export function getMinoColor(mino: Polyomino) {
  const color = colors[mino.transform.free().data]
  return {
    fill: color!.toString(),
    stroke: getBorderColor(color).toString(),
  }
}

/**
 * Return the stroke color of the link between the given pair of minos
 */

export function getLinkColor(src: Polyomino, tgt: Polyomino) {
  const color =
    linkColors[src.transform.free().data]?.[tgt.transform.free().data]
  if (!color) throw new Error(`Invalid mino pair given`)
  return color
}
