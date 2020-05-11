import tinycolor from "tinycolor2"
import { mapValues } from "lodash-es"

import type { Mino } from "mino/mino"
import { MONOMINO } from "mino/mino"

import type { Symmetry } from "mino/transform"
import { getTransforms, getSymmetry } from "mino/transform"
import { getChildren as getMinoChildren } from "mino/generate"

type Color = tinycolor.Instance

const baseColorMap: Record<Symmetry, string> = {
  none: "dimgray",
  reflectOrtho: "crimson",
  reflectDiag: "#22d",
  rotate2: "limegreen",
  dihedralOrtho: "gold",
  dihedralDiag: "turquoise",
  rotate4: "violet",
  all: "#ccc",
}

const borderColors = mapValues(baseColorMap, (col) =>
  tinycolor(col).darken(30).desaturate(40).spin(-30),
)

const colorMap: Record<Symmetry, Color> = mapValues(baseColorMap, (col) =>
  tinycolor(col),
)

// Use different mix percentages for different symmetries
// since we want desaturation in nonsymmetric minos to be prominent
const mixMap = {
  none: 50,
  reflectOrtho: 40,
  reflectDiag: 40,
  rotate2: 40,
  dihedralOrtho: 30,
  dihedralDiag: 30,
  rotate4: 30,
  all: 20,
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
  parents: Set<Mino>
  children: Set<Mino>
  color?: Color
  symmetry?: Symmetry
}

export function generateGraph(n: number) {
  const nodes: Mino[][] = []
  const links: [Mino, Mino][] = []
  if (n === 0) {
    return { nodes, links, meta: {} }
  }
  // An object containing metadata for each mino including:
  // * generation and index
  // * parents
  // * children
  // * symmetry info
  const meta: Record<Mino, MinoMeta> = {
    [MONOMINO]: {
      parents: new Set(),
      children: new Set(),
    },
  }
  const equivalences: Record<Mino, Mino> = {}
  let currentGen = [MONOMINO]
  // TODO don't need to iterate over children of last generation!
  while (nodes.length < n - 1) {
    const nextGen = []
    for (let mino of currentGen) {
      for (let child of getMinoChildren(mino)) {
        if (!!equivalences[child]) {
          // If we have a rotation/translation of this child,
          // add the link but DON'T add the mino to the current gen
          const canonChild = equivalences[child]
          meta[mino].children.add(canonChild)
          meta[canonChild].parents.add(mino)
          links.push([mino, canonChild])
        } else {
          // If it's a completely new mino, log its transforms
          // and add it to the next gen
          for (let transform of getTransforms(child)) {
            equivalences[transform] = child
          }
          nextGen.push(child)
          links.push([mino, child])
          meta[mino].children.add(child)
          meta[child] = {
            children: new Set(),
            parents: new Set([mino]),
          }
        }
      }
    }
    nodes.push(currentGen)
    currentGen = nextGen
  }
  nodes.push(currentGen)

  // Generate mino colors
  // TODO can we seperate out this logic?
  for (let generation of nodes) {
    for (let mino of generation) {
      const sym = getSymmetry(mino)
      meta[mino].symmetry = sym
      if (mino === MONOMINO) {
        meta[mino].color = colorMap[sym]
        continue
      }
      const color = mixColors(
        [...meta[mino].parents].map((parent) => meta[parent].color!),
      )
      meta[mino].color = tinycolor.mix(colorMap[sym], color, mixMap[sym])
    }
  }

  // TODO these links are duplicated; uniqWith adds 500ms
  return { nodes, links, meta }
}

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

/**
 * Return the fill and stroke of the given mino to pass in as SVG props:
 *
 * <MinoSvg {...getMinoColor(mino)} />
 */
export function getMinoColor(mino: Mino) {
  return {
    fill: meta[mino].color!.toString(),
    stroke: borderColors[meta[mino].symmetry!].toString(),
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
