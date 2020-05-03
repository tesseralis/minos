import {
  WIDTH_BITS,
  MAX_WIDTH,
  MONOMINO,
  getMino,
  getData,
  getWidth,
  getPoints,
} from './mino'

import type { Mino, Coord } from './mino'

import { getSymmetry, getTransforms } from './transform'
import type { Symmetry } from './transform'
import mapValues from 'lodash/mapValues'
import tinycolor from 'tinycolor2'

/**
 * Functions dealing with generation of polyominoes.
 */

/**
 * Get the point `[i, j]` in the mino with width `w`.
 */
function getPointMask(i: number, j: number, w: number) {
  return 1 << (i * w + j + WIDTH_BITS)
}

/**
 * Returns true if the mino contains the given point
 */
function contains(mino: Mino, [i, j]: Coord) {
  const w = getWidth(mino)
  if (i < 0 || j < 0 || j >= w) {
    return false
  }
  return !!(mino & getPointMask(i, j, w))
}

/**
 * Return the neighbors of the point [i,j]
 */
function* nbrs([i, j]: Coord): Generator<Coord> {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield [i + 1, j]
  yield [i - 1, j]
  yield [i, j + 1]
  yield [i, j - 1]
}

/**
 * Get all neighboring points of the given mino
 */
function* getNeighbors(mino: Mino) {
  for (let point of getPoints(mino)) {
    for (let nbr of nbrs(point)) {
      if (!contains(mino, nbr)) {
        yield nbr
      }
    }
  }
}

function shiftUp(mino: Mino) {
  const w = getWidth(mino)
  const data = mino >> WIDTH_BITS
  return getMino(data << w, w)
}

function incWidth(mino: Mino) {
  const w = getWidth(mino)
  if (w === MAX_WIDTH) throw new Error('Already at maximum width')
  let result = 0
  let i = 0
  let data = getData(mino)
  while (data) {
    const row = data % (1 << w)
    result = result | (row << (i * (w + 1)))
    i++
    data = data >> w
  }
  return getMino(result, w + 1)
}

function shiftLeft(mino: Mino) {
  const expanded = incWidth(mino)
  const data = getData(expanded)

  return getMino(data << 1, getWidth(expanded))
}

function doAppend(mino: Mino, i: number, j: number) {
  return mino | getPointMask(i, j, getWidth(mino))
}

// Append the point [i,j] to the mino
function append(mino: Mino, [i, j]: Coord) {
  const w = getWidth(mino)
  if (i < 0) {
    return doAppend(shiftUp(mino), 0, j)
  }
  if (j < 0) {
    return doAppend(shiftLeft(mino), i, 0)
  }
  if (j === w) {
    return doAppend(incWidth(mino), i, j)
  }
  // otherwise add the point value to the mino
  return doAppend(mino, i, j)
}

// Get the children of the given mino
function* getChildren(mino: Mino) {
  // get all neighbors
  const nbrs = getNeighbors(mino)
  for (let nbr of nbrs) {
    yield append(mino, nbr)
  }
}

// Get the children of the given collection of minos
function getAllChildren(minos: Iterable<Mino>): Set<Mino> {
  let result = new Set<Mino>()
  for (let parent of minos) {
    for (let child of getChildren(parent)) {
      result.add(child)
    }
  }
  return result
}

/**
 * Generates all the n-ominoes, that is, the polyoinoes with n squares.
 */
export function generate(n: number): Set<Mino> {
  // do something here
  if (n === 0) {
    return new Set()
  }
  if (n === 1) {
    return new Set([MONOMINO])
  } else {
    const parentGen = generate(n - 1)
    return getAllChildren(parentGen)
  }
}

const baseColorMap: Record<Symmetry, string> = {
  none: 'dimgray',
  reflectOrtho: 'crimson',
  reflectDiag: '#22d',
  rotate2: 'limegreen',
  dihedralOrtho: 'gold',
  dihedralDiag: 'turquoise',
  rotate4: 'violet',
  all: '#ccc',
}

const borderColors = mapValues(baseColorMap, (col) =>
  tinycolor(col).darken(30).desaturate(40).spin(-30).toString(),
)

const colorMap: Record<Symmetry, tinycolor.Instance> = mapValues(
  baseColorMap,
  (col) => tinycolor(col),
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

function mixColors(colors: tinycolor.Instance[]) {
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
  color?: tinycolor.Instance
  borderColor?: string
}

export function generateGraph(n: number) {
  const nodes: number[][] = []
  const links: number[][] = []
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
      for (let child of getChildren(mino)) {
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
      meta[mino].borderColor = borderColors[sym]!
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
