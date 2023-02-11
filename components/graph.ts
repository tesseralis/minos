import tinycolor from "tinycolor2"
import { uniqBy, sortBy, mapValues } from "lodash"

import { Polyomino, RelativeLink, MinoClass, Symmetry, MONOMINO } from "mino"

type Color = tinycolor.Instance
type MinoData = number

// TODO now that we don't parent/child colors any more, we can move color-related stuff
// to a different location
const symmetryColorMap: Record<Symmetry, string> = {
  none: "#aaa",
  axis: "#e22",
  diag: "#66f",
  rot: "limegreen",
  axis2: "gold",
  diag2: "turquoise",
  rot2: "violet",
  all: "#dee",
}

/**
 * Get the color associated with the given symmetry
 */
export function getSymmetryColor(symmetry: Symmetry): string {
  return symmetryColorMap[symmetry]
}

const classColorMap: Record<MinoClass, string> = {
  "punctured rectangle": "#ddd",
  rectangle: "#ccc", // white
  "Ferrers graph": "#f5f", // magenta
  staircase: "#62f", // violet
  stack: "#f28", // rose
  "directed convex": "#05f", // blue
  "bar graph": "#f22", // red
  convex: "#08f", // azure
  "directed semiconvex": "#f60", // orange
  crescent: "#0cf", // cyan
  directed: "#fc3", // yellow
  semiconvex: "#0fb", // teal
  predirected: "#ad0", // lime
  semidirected: "#2a2", // green
  other: "#484", // grey
}
/**
 * Get the unique randomized color ID for the given polyomino.
 */
function getNoise(mino: Polyomino) {
  let data = mino.transform.free().data
  let h = 0
  while (data) {
    h = h ^ data % (1 << 4)
    data >>= 4
  }
  h = h / (1 << 4)
  return tinycolor.fromRatio({ h, s: 1, v: 1 })
}

function getBorderColor(color: Color) {
  return color.clone().darken(50).desaturate(40).spin(-30)
}

const colorMap: Record<MinoClass, Color> = mapValues(classColorMap, (col) =>
  tinycolor(col).desaturate(30),
)

export function getClassColor(cls: MinoClass) {
  return classColorMap[cls]
}

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
      colors[mino.data] = tinycolor.mix(colorMap[minoClass], getNoise(mino), 5)
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
  let color
  // TODO deduplicate this with when the colors are cached for n <= 8
  // (why do we do this again?)
  if (mino.order <= 8) {
    color = colors[mino.transform.free().data]
  } else {
    const minoClass = mino.classes.best()
    color = tinycolor.mix(colorMap[minoClass], getNoise(mino), 5)
  }
  return {
    fill: color!.toHexString(),
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
