import tinycolor from "tinycolor2"
import { uniqBy, sortBy, mapValues } from "lodash-es"

import { Polyomino, RelativeLink, Symmetry, MONOMINO } from "mino"

type Color = tinycolor.Instance
type MinoData = number

const baseColorMap: Record<Symmetry, string> = {
  none: "#aaa",
  reflectOrtho: "#e22",
  reflectDiag: "#66f",
  rotate2: "limegreen",
  dihedralOrtho: "gold",
  dihedralDiag: "violet",
  rotate4: "turquoise",
  all: "#dee",
}

export function getSymmetryColor(symmetry: Symmetry): string {
  return baseColorMap[symmetry]
}

const borderColors = mapValues(baseColorMap, (col) =>
  tinycolor(col).darken(40).desaturate(40).spin(-30),
)

const colorMap: Record<Symmetry, Color> = mapValues(baseColorMap, (col) =>
  tinycolor(col),
)

// Use different mix percentages for different symmetries
// since we want desaturation in nonsymmetric minos to be prominent
const mixMap = {
  none: 50,
  reflectOrtho: 30,
  reflectDiag: 30,
  rotate2: 30,
  dihedralOrtho: 20,
  dihedralDiag: 20,
  rotate4: 20,
  all: 0,
}

function sum(nums: number[]) {
  return nums.reduce((s, n) => s + n, 0)
}

function avg(nums: number[]) {
  return sum(nums) / nums.length
}

function mixColors(colors: Color[]) {
  const rgbs = colors.map((c) => c.toRgb())
  return tinycolor({
    r: avg(rgbs.map((c) => c.r)),
    g: avg(rgbs.map((c) => c.g)),
    b: avg(rgbs.map((c) => c.b)),
    a: avg(rgbs.map((c) => c.a)),
  })
}

interface MinoMeta {
  parents: Set<MinoData>
  children: Set<MinoData>
  symmetry: Symmetry
  color?: Color
  index: number
}

function getParentKey(mino: Polyomino, indices: Record<MinoData, number>) {
  return avg([...mino.freeParents()].map((p) => indices[p.data]))
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
      for (const child of mino.children()) {
        if (!visited.has(child.free().data)) {
          nextGen.push(child.free())
          visited.add(child.free().data)
        }
        links.push([mino, child.free()])
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
      const symmetry = mino.symmetry()
      if (mino.equals(MONOMINO)) {
        colors[mino.data] = colorMap[symmetry]
        continue
      }
      const color = mixColors(
        mino.parents().map((parent) => colors[parent.free().data]),
      )
      colors[mino.data] = tinycolor.mix(
        colorMap[symmetry],
        color,
        mixMap[symmetry],
      )
    }
  }

  return { nodes, links, colors, indices }
}

export const NUM_GENERATIONS = 8
const { nodes, links, colors, indices } = generateGraph(NUM_GENERATIONS)

const allMinos = nodes.flat()

export const MAX_NUM_PARENTS = Math.max(
  ...allMinos.map((mino) => mino.freeParents().size),
)
export const MAX_NUM_CHILDREN = Math.max(
  ...allMinos.map((mino) => mino.freeChildren().size),
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
  const uniq = uniqBy([...minos], ({ mino }) => mino.free())
  return sortBy(uniq, ({ mino }) => getIndex(mino))
}

/**
 * Get the parents of the mino sorted by their indices in the graph
 */
export function getSortedParents(mino: Polyomino): RelativeLink[] {
  return getUniqSorted(mino.enumerateParents())
}

/**
 * Get the children of the mino sorted by their indices in the graph
 */
export function getSortedChildren(mino: Polyomino): RelativeLink[] {
  if (mino.order === NUM_GENERATIONS) return []
  return getUniqSorted(mino.enumerateChildren())
}

/**
 * Get the index of the mino within its generation
 */
export function getIndex(mino: Polyomino) {
  return indices[mino.free().data]
}

/**
 * Return the fill and stroke of the given mino to pass in as SVG props:
 *
 * <MinoSvg {...getMinoColor(mino)} />
 */
export function getMinoColor(mino: Polyomino) {
  const color = colors[mino.free().data]
  const symmetry = mino.symmetry()
  return {
    fill: color!.toString(),
    stroke: borderColors[symmetry].toString(),
  }
}

/**
 * Return the stroke color of the link between the given pair of minos
 */

export function getLinkColor(src: Polyomino, tgt: Polyomino) {
  const color = linkColors[src.free().data]?.[tgt.free().data]
  if (!color) throw new Error(`Invalid mino pair given`)
  return color
}
