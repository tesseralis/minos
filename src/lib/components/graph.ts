import tinycolor from "tinycolor2"
import { uniqBy, sortBy, mapValues } from "lodash-es"

import {
  Polyomino,
  type RelativeLink,
  type Symmetry,
  MONOMINO,
} from "$lib/mino"
import type { MinoKey } from "$lib/mino/dataArray"

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

const classColorMap: Record<string, string> = {
  rectangle: "#dbd", // white
  wedge: "#f5f", // magenta
  staircase: "#82f", // violet
  stack: "#f28", // rose
  fork: "#44f", // blue
  "bar chart": "#f22", // red
  diamond: "#08f", // azure
  wing: "#f60", // orange
  crescent: "#0cf", // cyan
  antler: "#fc3", // yellow
  "range chart": "#0fb", // teal
  "bent tree": "#ad0", // lime
  tree: "#2a2", // green
  other: "#686", // grey
}

function getBorderColor(color: Color) {
  return color.clone().darken(50).desaturate(40).spin(-30)
}

const colorMap: Record<string, Color> = mapValues(classColorMap, (col) =>
  tinycolor(col).desaturate(30),
)

export function getClassColor(cls: string) {
  return classColorMap[cls]
}

function sum(nums: number[]) {
  return nums.reduce((s, n) => s + n, 0)
}

function avg(nums: number[]) {
  return sum(nums) / nums.length
}

// function getParentKey(mino: Polyomino, indices: Record<MinoKey, number>) {
//   return avg([...mino.freeParents()].map((p) => indices[p.key]))
// }

/**
 * Sort the list of minos by the average of their parents' indices
 */
function sortByParents(minos: Polyomino[], indices: Record<MinoData, number>) {
  return minos
  // return sortBy(minos, (mino) => getParentKey(mino, indices))
}

export function generateGraph(n: number) {
  const nodes: Polyomino[][] = []
  const links: [Polyomino, Polyomino][] = []

  // mapping from each mino to its index in the generation
  const indices: Record<MinoKey, number> = {
    [MONOMINO.key]: 0,
  }
  // console.log("creating graph")
  // return { nodes, links, indices }
  const visited = new Set<MinoKey>([MONOMINO.key])
  let currentGen = [MONOMINO]

  // TODO don't need to iterate over children of last generation
  while (nodes.length < n - 1) {
    const nextGen = []
    for (const mino of currentGen) {
      for (const child of mino.freeChildren()) {
        // if (!child.equals(child.transform.free())) {
        //   console.log("parent: ")
        //   console.log(mino.display() + "\n")
        //   console.log(child.display() + "\n")
        // }
        if (!visited.has(child.key)) {
          nextGen.push(child)
          visited.add(child.key)
        }
        links.push([mino, child])
      }
    }

    nodes.push(currentGen)
    // currentGen = sortByParents(nextGen, indices)
    currentGen = nextGen
    currentGen.forEach((mino, i) => {
      indices[mino.key] = i
    })
  }
  nodes.push(currentGen)

  return { nodes, links, indices }
}

export const NUM_GENERATIONS = 8
const { nodes, links, indices } = generateGraph(NUM_GENERATIONS)

// const allMinos = nodes.flat()

// export const MAX_NUM_PARENTS = Math.max(
//   ...allMinos.map((mino) => mino.freeParents().size),
// )
// export const MAX_NUM_CHILDREN = Math.max(
//   ...allMinos.map((mino) => mino.freeChildren().size),
// )

export { nodes, links }

function getUniqSorted(minos: RelativeLink[]): RelativeLink[] {
  const uniq = uniqBy([...minos], ({ mino }) => mino.transform.free())
  return sortBy(uniq, ({ mino }) => getIndex(mino))
}

/**
 * Get the parents of the mino sorted by their indices in the graph
 */
// export function getSortedParents(mino: Polyomino): RelativeLink[] {
//   return getUniqSorted(mino.enumerateParents())
// }

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
  return indices[mino.transform.free().key]
}

/**
 * Return the fill and stroke of the given mino to pass in as SVG props:
 */
export function getMinoColor(mino: Polyomino) {
  const minoClass = mino.classes.get().name()
  const color = colorMap[minoClass]
  return {
    fill: color!.toHexString(),
    stroke: getBorderColor(color).toString(),
  }
}
