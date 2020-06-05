/**
 * This modules describes utility functions to apply transformations to polyominoes.
 */

import { Coord, Dims } from "./data"

export const rotations = ["rotateLeft", "rotateHalf", "rotateRight"] as const

export const reflections = [
  "flipHoriz",
  "flipVert",
  "flipMainDiag",
  "flipMinorDiag",
] as const

export const transforms = ["identity", ...rotations, ...reflections] as const

export type Rotation = typeof rotations[number]
export type Reflection = typeof reflections[number]
export type Transform = typeof transforms[number]

export function transformCoord(
  [i, j]: Coord,
  [w, h]: Dims,
  transform: Transform,
): Coord {
  const i1 = w - 1 - i
  const j1 = h - 1 - j
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

export type Symmetry =
  | "all"
  | "dihedralOrtho"
  | "dihedralDiag"
  | "rotate4"
  | "reflectOrtho"
  | "reflectDiag"
  | "rotate2"
  | "none"

export function getSymmetry(predicate: (axis: Transform) => boolean) {
  function getSymCount(axes: Transform[]): number {
    return axes.filter((axis) => predicate(axis)).length
  }
  const orthogonal = getSymCount(["flipHoriz", "flipVert"])
  const diagonal = getSymCount(["flipMainDiag", "flipMinorDiag"])
  const rotational = getSymCount(["rotateHalf", "rotateLeft"])

  if (orthogonal === 2 && diagonal === 2 && rotational === 2) return "all"

  if (orthogonal === 2) return "dihedralOrtho"
  if (diagonal === 2) return "dihedralDiag"
  if (rotational === 2) return "rotate4"

  if (orthogonal === 1) return "reflectOrtho"
  if (diagonal === 1) return "reflectDiag"
  if (rotational === 1) return "rotate2"

  return "none"
}
