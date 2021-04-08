/**
 * This modules describes utility functions to apply transformations to polyominoes.
 */

import { once } from "lodash-es"
import { Polyomino } from "."
import Vector, { Point } from "vector"
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

const anchorPositions = ["start", "end"] as const
type AnchorPos = typeof anchorPositions[number]
export interface Anchor {
  x: AnchorPos
  y: AnchorPos
}

export function* getAnchors(): Generator<Anchor> {
  for (const x of anchorPositions) {
    for (const y of anchorPositions) {
      yield { x, y }
    }
  }
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
  const transforms: Record<Transform, Point> = {
    identity: [p.x, p.y],
    rotateLeft: [p.y, -p.x],
    rotateHalf: [-p.x, -p.y],
    rotateRight: [-p.y, p.x],
    flipHoriz: [-p.x, p.y],
    flipVert: [p.x, -p.y],
    flipMainDiag: [p.y, p.x],
    flipMinorDiag: [-p.y, -p.x],
  }
  return Vector.fromArray(transforms[transform])
}

// TODO express this in terms of transformCoord
export function transformMinoCoord(
  p: Coord,
  [w, h]: Dims,
  transform: Transform,
): Coord {
  const x1 = w - 1 - p.x
  const y1 = h - 1 - p.y
  const transforms: Record<Transform, Point> = {
    identity: [p.x, p.y],
    rotateLeft: [p.y, x1],
    rotateHalf: [x1, y1],
    rotateRight: [y1, p.x],
    flipHoriz: [x1, p.y],
    flipVert: [p.x, y1],
    flipMainDiag: [p.y, p.x],
    flipMinorDiag: [y1, x1],
  }
  return Vector.fromArray(transforms[transform])
}

export const symmetries = [
  "all",
  "dihedralOrtho",
  "dihedralDiag",
  "rotate4",
  "reflectOrtho",
  "reflectDiag",
  "rotate2",
  "none",
] as const

export type Symmetry = typeof symmetries[number]

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

export default class MinoTransform {
  private mino: Polyomino
  private _free?: Polyomino

  constructor(mino: Polyomino) {
    this.mino = mino
  }

  // Transforms and symmetry
  // =======================

  /** Transform this mino with the given transformation */
  apply(trans: Transform) {
    return Polyomino.fromCoords(
      this.mino
        .coords()
        .map((p) => transformMinoCoord(p, this.mino.dims, trans)),
    )
  }

  /** Return the list of all transforms of this mino */
  // TODO make this unique
  transforms = once(() => transforms.map((t) => this.apply(t)))

  /** true if this mino is symmetric wrt the given transform */
  hasSymmetry(t: Transform) {
    return this.mino.equals(this.apply(t))
  }

  /** true if the mino is the same as its reflection */
  isOneSided = once(() => !reflections.some((t) => this.hasSymmetry(t)))

  /** Get the symmetry of this mino */
  symmetry = once(() => getSymmetry((axis) => this.hasSymmetry(axis)))

  /** Get the free polyomino corresponding to this mino */
  free() {
    if (!this._free) {
      const transforms = this.transforms()
      const free = Polyomino.sort(transforms)[0]
      // populate the free polyomino for all the transforms
      // so we don't have to re-calculate
      for (const trans of transforms) {
        trans.transform._free = free
      }
    }
    // this._free should now be defined
    return this._free!
  }

  /** Returns true if the two minos are equivalent under transformations */
  equivalent(other: Polyomino) {
    return this.free().equals(other.transform.free())
  }
}
