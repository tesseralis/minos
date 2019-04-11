export const WIDTH_BITS = 4
export const MAX_WIDTH = 1 << WIDTH_BITS

export function getData(mino) {
  return mino >> WIDTH_BITS
}

export function getSize(mino) {
  let data = getData(mino)
  let size = 0
  while (data) {
    size += data & 1
    data = data >> 1
  }
  return size
}

export function getWidth(mino) {
  return mino % MAX_WIDTH || MAX_WIDTH
}

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x)
}

export function getHeight(mino) {
  const w = getWidth(mino)
  const data = getData(mino)
  return Math.floor(getBaseLog(2, data) / w) + 1
}

export function getShape(mino) {
  return [getWidth(mino), getHeight(mino)]
}

export function getMino(data, width) {
  return (data << WIDTH_BITS) | (width === MAX_WIDTH ? 0 : width)
}

export const MONOMINO = getMino(1, 1)

export function* getPoints(mino) {
  let data = getData(mino)
  let w = getWidth(mino)
  let k = 0
  while (data) {
    if (data & 1) {
      yield [(k / w) >> 0, k % w]
    }
    k++
    data = data >> 1
  }
}

export function fromPoints(points) {
  const w = Math.max(...points.map(p => p[1])) + 1
  let result = 0
  for (let [i, j] of points) {
    result = result | (1 << (w * i + j))
  }
  return getMino(result, w)
}

function padLeft(str, char, width) {
  if (str.length >= width) {
    return str
  }
  return char.repeat(width - str.length) + str
}

export function displayMino(mino, { block = '□', space = ' ️' }) {
  const w = getWidth(mino)
  let data = getData(mino)
  const result = []
  while (data) {
    const row = data % (1 << w)
    const str = padLeft(row.toString(2), '0', w)
    result.push([...str].join(' '))
    data = data >> w
  }
  return result
    .reverse()
    .join('\n')
    .replace(/1/g, block)
    .replace(/0/g, space)
}

export function printMino(mino, opts = {}) {
  console.log(displayMino(mino, opts))
}
