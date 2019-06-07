import {
  WIDTH_BITS,
  MAX_WIDTH,
  MONOMINO,
  getMino,
  getData,
  getWidth,
  getPoints,
} from './mino'

import { getSymmetry, getTransforms } from './transform'
import tinycolor from 'tinycolor2'

function getPointMask(i, j, w) {
  return 1 << (i * w + j + WIDTH_BITS)
}

function contains(mino, [i, j]) {
  const w = getWidth(mino)
  if (i < 0 || j < 0 || j >= w) {
    return false
  }
  return !!(mino & getPointMask(i, j, w))
}

function* nbrs(i, j) {
  // TODO it turns out this order greatly impacts the order of the minos
  // either standardize it or sort the minos independently
  yield [i + 1, j]
  yield [i - 1, j]
  yield [i, j + 1]
  yield [i, j - 1]
}

function* getNeighbors(mino) {
  for (let [i, j] of getPoints(mino)) {
    for (let nbr of nbrs(i, j)) {
      if (!contains(mino, nbr)) {
        yield nbr
      }
    }
  }
}

function shiftUp(mino) {
  const w = getWidth(mino)
  const data = mino >> WIDTH_BITS
  return getMino(data << w, w)
}

function incWidth(mino) {
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

function shiftLeft(mino) {
  const expanded = incWidth(mino)
  const data = getData(expanded)

  return getMino(data << 1, getWidth(expanded))
}

function doAppend(mino, i, j) {
  return mino | getPointMask(i, j, getWidth(mino))
}

function append(mino, [i, j]) {
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

function* getChildren(mino) {
  // get all neighbors
  const nbrs = getNeighbors(mino)
  for (let nbr of nbrs) {
    yield append(mino, nbr)
  }
}

function getAllChildren(minos) {
  let result = new Set()
  for (let parent of minos) {
    for (let child of getChildren(parent)) {
      result.add(child)
    }
  }
  return result
}

export function generate(n) {
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

const colorMap = {
  none: 'dimgray',
  reflectOrtho: 'crimson',
  reflectDiag: '#33f',
  rotate2: 'limegreen',
  dihedralOrtho: 'gold',
  dihedralDiag: 'turquoise',
  rotate4: 'violet',
  all: '#ddd',
}

for (let key of Object.keys(colorMap)) {
  colorMap[key] = tinycolor(colorMap[key])
}

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

function sum(nums) {
  return nums.reduce((s, n) => s + n, 0)
}

function avg(nums) {
  return sum(nums) / nums.length
}

function mixColors(colors) {
  const rgbs = colors.map(c => c.toRgb())
  return tinycolor({
    r: avg(rgbs.map(c => c.r)),
    g: avg(rgbs.map(c => c.g)),
    b: avg(rgbs.map(c => c.b)),
    a: avg(rgbs.map(c => c.a)),
  })
}

export function generateGraph(n) {
  if (n === 0) {
    return {}
  }
  const nodes = []
  const links = []
  // An object containing metadata for each mino including:
  // * generation and index
  // * parents
  // * children
  // * (symmetry info)
  const meta = {
    [MONOMINO]: {
      parents: new Set(),
      children: new Set(),
    },
  }
  const equivalences = {}
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

  // TODO can we separate out this logic?
  for (let generation of nodes) {
    for (let mino of generation) {
      if (mino === MONOMINO) {
        meta[mino].color = colorMap[getSymmetry(mino)]
        continue
      }
      const color = mixColors(
        [...meta[mino].parents].map(parent => meta[parent].color),
      )
      const sym = getSymmetry(mino)
      meta[mino].color = tinycolor.mix(colorMap[sym], color, mixMap[sym])
    }
  }

  // TODO these links are duplicated; uniqWith adds 500ms
  return { nodes, links, equivalences, meta }
}
