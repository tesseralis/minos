/**
 * This modules describes utility functions to apply transformations to polyominoes.
 */

import Vector from "vector"
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
  p: Coord,
  [w, h]: Dims,
  transform: Transform,
): Coord {
  const x1 = w - 1 - p.x
  const y1 = h - 1 - p.y
  const transforms = {
    identity: p,
    rotateLeft: new Vector(p.y, x1),
    rotateHalf: new Vector(x1, y1),
    rotateRight: new Vector(y1, p.x),
    flipHoriz: new Vector(x1, p.y),
    flipVert: new Vector(p.x, y1),
    flipMainDiag: new Vector(p.y, p.x),
    flipMinorDiag: new Vector(y1, x1),
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
