/**
 * Methods to apply transformations to polyominoes.
 */

import type { Coord } from "./data"
import { Polyomino } from "./internal"
import { encode, px, py } from "./data"
import { minWith } from "$lib"

export const rotations = ["rotateLeft", "rotateHalf", "rotateRight"] as const

export const reflections = [
  "flipHoriz",
  "flipVert",
  "flipMainDiag",
  "flipMinorDiag",
] as const

export const transforms = ["identity", ...rotations, ...reflections] as const

export type Rotation = (typeof rotations)[number]
export type Reflection = (typeof reflections)[number]
export type Transform = (typeof transforms)[number]

const anchorPositions = ["start", "end"] as const
type AnchorPos = (typeof anchorPositions)[number]
export interface Anchor {
  x: AnchorPos
  y: AnchorPos
}

export const symmetries = [
  "all",
  "axis2",
  "rot2",
  "diag2",
  "axis",
  "rot",
  "diag",
  "none",
] as const

export type Symmetry = (typeof symmetries)[number]

/**
 * Methods related to the transformation and symmetry of a Polyomino
 */
export default class MinoTransform {
  private mino: Polyomino
  private _free?: Polyomino

  constructor(mino: Polyomino) {
    this.mino = mino
  }

  /** Transform this mino with the given transformation */
  apply(trans: Transform) {
    const [w, h] = this.mino.dims
    if (trans === "identity") return this.mino
    return Polyomino.fromData(
      this.mino.data.map((m) => transformMinoMask(m, w, h, trans)),
    )
  }

  rotations() {
    return ["identity" as const, ...rotations].map((t) => this.apply(t))
  }

  /** Return the list of all transforms of this mino */
  // TODO make this unique
  all() {
    return transforms.map((t) => this.apply(t))
  }

  /** true if this mino is symmetric wrt the given transform */
  hasSymmetry(t: Transform) {
    return this.mino.equals(this.apply(t))
  }

  /** true if the mino is the same as its reflection */
  isOneSided() {
    return !reflections.some((t) => this.hasSymmetry(t))
  }

  /** Get the symmetry of this mino */
  symmetry() {
    return getSymmetry((axis) => this.hasSymmetry(axis))
  }

  /** Get the free polyomino corresponding to this mino */
  free() {
    if (!this._free) {
      const transforms = this.all()
      const free = minWith(transforms, (a, b) => a.cmp(b))
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

/**
 * List all possible anchors
 */
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
  return encode(x, y)
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
  const x = px(p)
  const y = py(p)
  const transforms: Record<Transform, Coord> = {
    identity: encode(x, y),
    rotateLeft: encode(y, -x),
    rotateHalf: encode(-x, -y),
    rotateRight: encode(-y, x),
    flipHoriz: encode(-x, y),
    flipVert: encode(x, -y),
    flipMainDiag: encode(y, x),
    flipMinorDiag: encode(-y, -x),
  }
  return transforms[transform]
}

function transformMinoMask(
  m: number,
  w: number,
  h: number,
  transform: Transform,
) {
  switch (transform) {
    case "identity": {
      return m
    }
    case "rotateHalf": {
      return encode(w - 1, h - 1) - m
    }
    case "rotateLeft": {
      return encode(py(m), w - 1 - px(m))
    }
    case "rotateRight": {
      return encode(h - 1 - py(m), px(m))
    }
    case "flipVert": {
      return encode(px(m), h - 1 - py(m))
    }
    case "flipHoriz": {
      return encode(w - 1 - px(m), py(m))
    }
    case "flipMainDiag": {
      return encode(py(m), px(m))
    }
    case "flipMinorDiag": {
      return encode(h - 1 - py(m), w - 1 - px(m))
    }
  }
}

function getSymmetry(predicate: (axis: Transform) => boolean) {
  function getSymCount(axes: Transform[]): number {
    return axes.filter((axis) => predicate(axis)).length
  }
  const orthogonal = getSymCount(["flipHoriz", "flipVert"])
  const diagonal = getSymCount(["flipMainDiag", "flipMinorDiag"])
  const rotational = getSymCount(["rotateHalf", "rotateLeft"])

  if (orthogonal === 2 && diagonal === 2 && rotational === 2) return "all"

  if (orthogonal === 2) return "axis2"
  if (diagonal === 2) return "diag2"
  if (rotational === 2) return "rot2"

  if (orthogonal === 1) return "axis"
  if (diagonal === 1) return "diag"
  if (rotational === 1) return "rot"

  return "none"
}

const symNames: Record<Symmetry, string> = {
  none: "none",
  axis: "reflective (axis)",
  diag: "reflective (diagonal)",
  rot: "rotational (2-fold)",
  axis2: "reflective (2 axes)",
  diag2: "reflective (2 diagonals)",
  rot2: "rotational (4-fold)",
  all: "all",
}

export function printSymmetry(sym: Symmetry) {
  return symNames[sym]
}
