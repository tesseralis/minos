/**
 * This modules describes functions to apply transformations to polyominoes:
 * rotation and reflection.
 */

import type { Point } from "math"
import { getShape, getPoints, fromPoints } from "./mino"
import type { Mino, Dims } from "./mino"

const transforms = [
  "identity",
  "rotateLeft",
  "rotateHalf",
  "rotateRight",
  "flipHoriz",
  "flipVert",
  "flipMainDiag",
  "flipMinorDiag",
] as const

export type Transform = typeof transforms[number]

function transformPoint(
  [i, j]: Point,
  [w, h]: Dims,
  transform: Transform,
): Point {
  const i1 = h - 1 - i
  const j1 = w - 1 - j
  const transforms = {
    identity: [i, j],
    rotateLeft: [j, i1],
    rotateHalf: [i1, j1],
    rotateRight: [j1, i],
    flipHoriz: [i1, j],
    flipVert: [i, j1],
    flipMainDiag: [j, i],
    flipMinorDiag: [j1, i1],
  } as const
  return transforms[transform]
}

export function transform(mino: Mino, transform: Transform) {
  return fromPoints(
    [...getPoints(mino)].map((p) =>
      transformPoint(p, getShape(mino), transform),
    ),
  )
}

export function getTransforms(mino: Mino) {
  return new Set(transforms.map((t) => transform(mino, t)))
}

export type Symmetry =
  | "all"
  | "dihedralOrtho"
  | "dihedralDiag"
  | "rotate4"
  | "reflectOrtho"
  | "reflectDiag"
  | "rotate2"
  | "none"

/**
 * Return whether the mino is symmetric with respect to the given transform
 */
export function hasSymmetry(mino: Mino, t: Transform) {
  return mino === transform(mino, t)
}

/**
 * Get the count of the given axes for which the mino equals the transformation
 * under that axis.
 */
function getSymCount(mino: Mino, axes: Transform[]): number {
  return axes.filter((axis) => hasSymmetry(mino, axis)).length
}

// TODO this function is kind of cumbersome...
/**
 * Get the symmetry of the polyomino
 * @param mino
 */
export function getSymmetry(mino: Mino): Symmetry {
  const orthogonal = getSymCount(mino, ["flipHoriz", "flipVert"])
  const diagonal = getSymCount(mino, ["flipMainDiag", "flipMinorDiag"])
  const rotational = getSymCount(mino, ["rotateHalf", "rotateLeft"])

  if (orthogonal === 2 && diagonal === 2 && rotational === 2) return "all"

  if (orthogonal === 2) return "dihedralOrtho"
  if (diagonal === 2) return "dihedralDiag"
  if (rotational === 2) return "rotate4"

  if (orthogonal === 1) return "reflectOrtho"
  if (diagonal === 1) return "reflectDiag"
  if (rotational === 1) return "rotate2"

  return "none"
}

/**
 *
 * @param minos
 * @return the set of minos with rotations/reflections removed
 */
export function getFree(minos: Mino[]) {
  const result = new Set()
  const dupes = new Set()
  for (const mino of minos) {
    if (!dupes.has(mino)) {
      result.add(mino)
      for (const t of getTransforms(mino)) {
        dupes.add(t)
      }
    }
  }
  return result
}
