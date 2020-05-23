import tinycolor from "tinycolor2"
import { mapValues } from "lodash-es"

import type { Mino } from "mino/mino"
import { MONOMINO } from "mino/mino"

import type { Symmetry } from "mino/transform"
import { getTransforms, getSymmetry } from "mino/transform"
import { getChildren as getMinoChildren } from "mino/generate"

type Color = tinycolor.Instance

const baseColorMap: Record<Symmetry, string> = {
  none: "#888",
  reflectOrtho: "crimson",
  reflectDiag: "#44d",
  rotate2: "limegreen",
  dihedralOrtho: "gold",
  dihedralDiag: "violet",
  rotate4: "turquoise",
  all: "#ccc",
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
  all: 10,
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
  symmetry: Symmetry
  color?: Color
}

export function generateGraph(n: number) {
  const nodes: Mino[][] = []
  const links: [Mino, Mino][] = []
  if (n === 0) {
    return { nodes, links, meta: {}, equivalences: {} }
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
      symmetry: getSymmetry(MONOMINO),
    },
  }
  const equivalences: Record<Mino, Mino> = {
    [MONOMINO]: MONOMINO,
  }
  let currentGen = [MONOMINO]
  // TODO don't need to iterate over children of last generation!
  while (nodes.length < n - 1) {
    const nextGen = []
    for (const mino of currentGen) {
      for (const child of getMinoChildren(mino)) {
        if (equivalences[child]) {
          // If we have a rotation/translation of this child,
          // add the link but DON'T add the mino to the current gen
          const canonChild = equivalences[child]
          meta[mino].children.add(canonChild)
          meta[canonChild].parents.add(mino)
          links.push([mino, canonChild])
        } else {
          // If it's a completely new mino, log its transforms
          // and add it to the next gen
          for (const transform of getTransforms(child)) {
            equivalences[transform] = child
          }
          nextGen.push(child)
          links.push([mino, child])
          meta[mino].children.add(child)
          meta[child] = {
            children: new Set(),
            parents: new Set([mino]),
            symmetry: getSymmetry(child),
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
  for (const generation of nodes) {
    for (const mino of generation) {
      // const sym = meta[mino].symmetry
      const sym = meta[mino].symmetry
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
  return { nodes, links, meta, equivalences }
}

export const numGenerations = 8
const { nodes, links, meta, equivalences } = generateGraph(numGenerations)

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

/**
 * Returns whether the first mino is a child of the second
 */
export function isParent(parent: Mino, child: Mino) {
  return meta[child].parents.has(parent)
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
    stroke: borderColors[meta[mino].symmetry].toString(),
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

export function getCanonical(mino: Mino) {
  return equivalences[mino]
}
