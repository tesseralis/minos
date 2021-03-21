/**
 * This modules describes utility functions to apply transformations to polyominoes.
 */

import type { Polyomino } from "mino"
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

type AnchorPos = "start" | "end"
interface Anchor {
  x: AnchorPos
  y: AnchorPos
}

/**
 * Get the anchor point for the given polyomino.
 */
export function getAnchor(mino: Polyomino, anchor: Anchor): Coord {
  const x = anchor.x === "start" ? 0 : mino.width
  const y = anchor.y === "start" ? 0 : mino.height
  return new Vector(x, y)
}

/**
 * Return the *current* anchor of the mino that will become the top-left anchor
 * when undergoing the given transformation.
 */
export function transformAnchor(transform: Transform): Anchor {
  switch (transform) {
    case "identity":
    case "flipMainDiag":
      return { x: "start", y: "start" }
    case "rotateLeft":
    case "flipHoriz":
      return { x: "end", y: "start" }
    case "rotateHalf":
    case "flipMinorDiag":
      return { x: "end", y: "end" }
    case "rotateRight":
    case "flipVert":
      return { x: "start", y: "end" }
  }
}

/**
 * Execute the given transform on the provided point.
 */
export function transformCoord(p: Coord, transform: Transform) {
  const transforms = {
    identity: p,
    rotateLeft: new Vector(p.y, -p.x),
    rotateHalf: new Vector(-p.x, -p.y),
    rotateRight: new Vector(-p.y, p.x),
    flipHoriz: new Vector(-p.x, p.y),
    flipVert: new Vector(p.x, -p.y),
    flipMainDiag: new Vector(p.y, p.x),
    flipMinorDiag: new Vector(-p.y, -p.x),
  } as const
  return transforms[transform]
}

// TODO express this in terms of transformCoord
export function transformMinoCoord(
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
