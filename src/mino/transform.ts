/**
 * This modules describes functions to apply transformations to polyominoes:
 * rotation and reflection.
 */

import { getShape, getPoints, fromPoints } from './mino'
import type { Mino, Coord, Dims } from './mino'

type Transform = (p: Coord, dims: Dims) => Coord

type Direction = 'left' | 'right' | 'half'
const rotations: Record<Direction, Transform> = {
  left: ([i, j], [w, h]) => [w - 1 - j, i],
  half: ([i, j], [w, h]) => [h - 1 - i, w - 1 - j],
  right: ([i, j], [w, h]) => [j, h - 1 - i],
}

type Axis = 'horiz' | 'vert' | 'mainDiag' | 'minorDiag'
const reflections: Record<Axis, Transform> = {
  horiz: ([i, j], [w, h]) => [i, w - 1 - j],
  vert: ([i, j], [w, h]) => [h - 1 - i, j],
  mainDiag: ([i, j]) => [j, i],
  minorDiag: ([i, j], [w, h]) => [w - 1 - j, h - 1 - i],
}

function transform(mino: Mino, fn: Transform) {
  const shape = getShape(mino)
  const newPoints = [...getPoints(mino)].map((p) => fn(p, shape))
  return fromPoints(newPoints)
}

export function rotate(mino: Mino, direction: Direction) {
  const fn = rotations[direction]
  return transform(mino, fn)
}

export function reflect(mino: Mino, axis: Axis) {
  const fn = reflections[axis]
  return transform(mino, fn)
}

export function getTransforms(mino: Mino) {
  return new Set([
    mino,
    rotate(mino, 'left'),
    rotate(mino, 'half'),
    rotate(mino, 'right'),
    reflect(mino, 'horiz'),
    reflect(mino, 'vert'),
    reflect(mino, 'mainDiag'),
    reflect(mino, 'minorDiag'),
  ])
}

type Symmetry =
  | 'all'
  | 'dihedralOrtho'
  | 'dihedralDiag'
  | 'rotate4'
  | 'reflectOrtho'
  | 'reflectDiag'
  | 'rotate2'
  | 'none'

// TODO this function is kind of cumbersome...
/**
 * Get the symmetry of the polyomino
 * @param mino
 */
export function getSymmetry(mino: Mino): Symmetry {
  const transforms = getTransforms(mino)
  switch (transforms.size) {
    case 1:
      return 'all'
    case 2:
      if (mino === reflect(mino, 'horiz')) {
        return 'dihedralOrtho'
      } else if (mino === reflect(mino, 'mainDiag')) {
        return 'dihedralDiag'
      } else if (mino === rotate(mino, 'half')) {
        return 'rotate4'
      }
      break
    case 4:
      if (mino === reflect(mino, 'horiz') || mino === reflect(mino, 'vert')) {
        return 'reflectOrtho'
      } else if (
        mino === reflect(mino, 'mainDiag') ||
        mino === reflect(mino, 'minorDiag')
      ) {
        return 'reflectDiag'
      } else if (mino === rotate(mino, 'half')) {
        return 'rotate2'
      }
      break
    case 8:
      return 'none'
  }
  throw new Error('invalid symmetry')
}

/**
 *
 * @param minos
 * @return the set of minos with rotations/reflections removed
 */
export function getFree(minos: Mino[]) {
  const result = new Set()
  const dupes = new Set()
  for (let mino of minos) {
    if (!dupes.has(mino)) {
      result.add(mino)
      for (let t of getTransforms(mino)) {
        dupes.add(t)
      }
    }
  }
  return result
}
