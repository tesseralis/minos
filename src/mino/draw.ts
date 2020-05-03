import some from 'lodash/some'
import isEqual from 'lodash/isEqual'
import minBy from 'lodash/minBy'

type Direction = 'left' | 'right' | 'up' | 'down'

type Point = [number, number]

function hasPoint(points: Point[], p: Point) {
  return some(points, (p2) => isEqual(p, p2))
}
function canTurn(points: Point[], [x, y]: Point, dir: Direction) {
  switch (dir) {
    case 'left':
      return !hasPoint(points, [x - 1, y])
    case 'down':
      return !hasPoint(points, [x, y])
    case 'right':
      return !hasPoint(points, [x, y - 1])
    case 'up':
      return !hasPoint(points, [x - 1, y - 1])
    default:
      throw new Error('invalid direction')
  }
}
function isBlocked(points: Point[], [x, y]: Point, dir: Direction) {
  switch (dir) {
    case 'up':
      return hasPoint(points, [x, y - 1])
    case 'right':
      return hasPoint(points, [x, y])
    case 'down':
      return hasPoint(points, [x - 1, y])
    case 'left':
      return hasPoint(points, [x - 1, y - 1])
    default:
      throw new Error('invalid direction')
  }
}

function move([x, y]: Point, dir: Direction): Point {
  switch (dir) {
    case 'left':
      return [x - 1, y]
    case 'right':
      return [x + 1, y]
    case 'down':
      return [x, y + 1]
    case 'up':
      return [x, y - 1]
    default:
      throw new Error('invalid direction')
  }
}
function turnLeft(dir: Direction) {
  switch (dir) {
    case 'left':
      return 'down'
    case 'down':
      return 'right'
    case 'right':
      return 'up'
    case 'up':
      return 'left'
    default:
      throw new Error('invalid direction')
  }
}

function turnRight(dir: Direction) {
  switch (dir) {
    case 'left':
      return 'up'
    case 'up':
      return 'right'
    case 'right':
      return 'down'
    case 'down':
      return 'left'
    default:
      throw new Error('invalid direction')
  }
}

export function getOutline(minoPoints: Point[]) {
  const origin = minBy(minoPoints)!
  let pos = origin
  let dir: Direction = 'down'
  const result = [origin]
  do {
    if (canTurn(minoPoints, pos, dir)) {
      result.push(pos)
      dir = turnLeft(dir)
    } else if (isBlocked(minoPoints, pos, dir)) {
      result.push(pos)
      dir = turnRight(dir)
    } else {
      pos = move(pos, dir)
    }
  } while (!isEqual(pos, origin))
  return result
}
