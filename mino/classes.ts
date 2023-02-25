import { once, range } from "lodash"
import Vector from "lib/vector"
import PointSet from "lib/PointSet"
import {
  Polyomino,
  Anchor,
  getAnchors,
  getNeighbors,
  getKingwiseNeighbors,
  DirClass,
} from "./internal"

const axes = ["row", "column"] as const
type Axis = typeof axes[number]
const sides = ["top", "left", "bottom", "right"] as const
type Side = typeof sides[number]

/**
 * Predicates for testing whether a mino belongs into one of the
 * specially defined classes of polyominoes, like directed minos.
 */
export default class MinoClasses {
  private mino: Polyomino

  constructor(mino: Polyomino) {
    this.mino = mino
  }

  /**
   * Get this polyomino's directedness class
   */
  get = once(() => {
    const dirSides = sides.filter((side) => this.isSemiDirectedAtSide(side))
    const dirDiags = this.anchors().filter((anchor) =>
      this.isDirectedAtAnchor(anchor),
    )
    let ortho: any = dirSides.length
    if (ortho === 2) {
      const [first, second] = dirSides
      ortho = `2-${isOppositeSides(first, second) ? "para" : "meta"}`
    }
    let diag: any = dirDiags.length
    if (diag === 2) {
      diag = `2-${hasOppositeAnchors(dirDiags) ? "para" : "meta"}`
    }

    return new DirClass(ortho, diag)
  })

  // Get the point of this polyomino's bounding box at the given corner anchor
  private pointAtAnchor({ x, y }: Anchor) {
    const [w, h] = this.mino.dims
    const xCoord = x === "start" ? 0 : w - 1
    const yCoord = y === "start" ? 0 : h - 1
    return new Vector(xCoord, yCoord)
  }

  // Get an arbitrary point on the given side
  private pointAtSide(side: Side): Vector {
    const [w, h] = this.mino.dims
    switch (side) {
      case "right":
      case "left": {
        const xCoord = side === "left" ? 0 : w - 1
        return range(h)
          .map((j) => new Vector(xCoord, j))
          .find((p) => this.mino.contains(p))!
      }
      case "top":
      case "bottom": {
        const yCoord = side === "top" ? 0 : h - 1
        return range(w)
          .map((i) => new Vector(i, yCoord))
          .find((p) => this.mino.contains(p))!
      }
    }
  }

  /** Return whether the polyomino has the given anchor */
  hasAnchor(anchor: Anchor) {
    return this.mino.contains(this.pointAtAnchor(anchor))
  }

  /** Return whether the polyomino is row or column-convex */
  isConvexAtAxis(axis: Axis) {
    const isRow = axis === "row"
    const [w, h] = this.mino.dims
    for (const x of range(0, isRow ? w : h)) {
      let foundFirst = false
      let inside = false
      for (const y of range(0, isRow ? h : w)) {
        if (this.mino.contains(isRow ? [x, y] : [y, x])) {
          // If we've already found a connected set of points befor
          // this is not convex
          if (foundFirst && !inside) {
            return false
          }
          foundFirst = true
          inside = true
        } else {
          inside = false
        }
      }
    }
    // If all rows/columns pass the test,
    // the whole polyomino is convex along that axis
    return true
  }

  /**
   * Return true if this polyomino is either row-convex or column-convex.
   */
  isSemiConvex = once(() => {
    return axes.some((axis) => this.isConvexAtAxis(axis))
  })

  /**
   * Return true if this polyomino is a "crescent"
   * (i.e. has a concavity in at most one direction)
   */
  isCrescent = once(() => {
    return sides.filter((side) => this.isSemiDirectedAtSide(side)).length >= 3
  })

  /**
   * Return whether this polyomino is convex,
   * that is, whether there are no "gaps"
   * between squares within the same row or coloumn.
   */
  isConvex = once(() => {
    return axes.every((axis) => this.isConvexAtAxis(axis))
  })

  /**
   * Return true if the polyomino has a puncture.
   */
  punctures = once(() => {
    // Iterate over all internal cells and see what's not in the mino
    // If one is found, do BFS and traverse until queue runs out or we get to the edge
    // If we get to the edge, it's not a puncture.
    const visited = new PointSet()
    const punctures = []
    for (let i = 1; i < this.mino.width - 1; i++) {
      for (let j = 1; j < this.mino.height - 1; j++) {
        const cell = Vector.of([i, j])
        if (!this.mino.contains(cell) && !visited.has(cell)) {
          const queue = [cell]
          const current = new PointSet()
          let connectedToEdge = false
          while (queue.length) {
            const currentCell = queue.shift()!
            current.add(currentCell)
            visited.add(currentCell)
            if (
              currentCell.x === 0 ||
              currentCell.x === this.mino.width - 1 ||
              currentCell.y === 0 ||
              currentCell.y === this.mino.height - 1
            ) {
              connectedToEdge = true
            }
            for (const nbr of getKingwiseNeighbors(currentCell)) {
              const inRange =
                nbr.x >= 0 &&
                nbr.x < this.mino.width &&
                nbr.y >= 0 &&
                nbr.y < this.mino.height
              if (inRange && !current.has(nbr) && !this.mino.contains(nbr)) {
                queue.push(nbr)
              }
            }
          }
          if (!connectedToEdge) {
            punctures.push(current)
          }
        }
      }
    }
    return punctures
  })

  /** Return whether the polyomino contains a hole */
  hasHole = once(() => {
    // First mino with a hole is a heptomino
    if (this.mino.order < 7) {
      return false
    }
    for (const x of range(1, this.mino.width - 1)) {
      for (const y of range(1, this.mino.height - 1)) {
        // Has a hole if there is a point inside the mino that isn't contained in the mino
        // but its neighbors are all in the mino.
        // Note: this only works for order <= 8
        const p = new Vector(x, y)
        if (this.mino.contains(p)) {
          break
        }
        const nbrs = [...getNeighbors(p)]
        if (nbrs.every((nbr) => this.mino.contains(nbr))) {
          return true
        }
      }
    }
    return false
  })

  // Get all the corner points of this polyomino that are contained in it
  private *iterAnchors(): Generator<Anchor> {
    for (const anchor of getAnchors()) {
      if (this.hasAnchor(anchor)) {
        yield anchor
      }
    }
  }

  /** Return all the contained anchors of this polyomino */
  anchors = once(() => {
    return [...this.iterAnchors()]
  })

  /** Returns whether the polyomino is directed at the given anchor */
  isSemiDirectedAtSide(side: Side) {
    // Get the three dimensions for the side
    const directions = getDirectionsForSide(side)
    const start = this.pointAtSide(side)
    // Do BFS in three orthogonal directions
    const visited = new PointSet()
    visited.add(start)
    const queue = [start]
    while (queue.length > 0) {
      const current = queue.shift()!
      for (const nbrDir of directions) {
        const nbr = current.add(nbrDir)
        if (this.mino.contains(nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          queue.push(nbr)
        }
      }
    }
    // If at the end, we visited all cells, it's semi-directed
    return visited.size === this.mino.order
  }

  /** Returns whether the polyomino is directed at the given anchor */
  isDirectedAtAnchor(anchor: Anchor) {
    if (!this.hasAnchor(anchor)) {
      return false
    }
    // Get the two directions of that corner
    const xDir = anchor.x === "end" ? Vector.LEFT : Vector.RIGHT
    const yDir = anchor.y === "end" ? Vector.UP : Vector.DOWN
    const start = this.pointAtAnchor(anchor)
    // Do BFS in the two orthogonal directions
    const visited = new PointSet()
    visited.add(start)
    const queue = [start]
    while (queue.length > 0) {
      const current = queue.pop()!
      for (const nbrDir of [yDir, xDir]) {
        const nbr = current.add(nbrDir)
        if (this.mino.contains(nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          queue.push(nbr)
        }
      }
    }
    // If at the end, we visited all cells, it's directed
    return visited.size === this.mino.order
  }

  /** Return all the anchors that this polyomino is directed at */
  directedAnchors = once(() => {
    return this.anchors().filter((anchor) => this.isDirectedAtAnchor(anchor))
  })

  /**
   * Returns whether the mino is semi-directed (aka orthogonally directed),
   * that is, there is some square in the mino such that all the other squares
   * can be reached from that mino in going three directions but not the fourth
   */
  isSemiDirected = once(() => {
    return sides.some((side) => this.isSemiDirectedAtSide(side))
  })

  /**
   * Return whether the mino is pre-directed, that is,
   * if it is semi-directed with respect to two adjacent directions.
   */
  isPreDirected = once(() => {
    const semiDirSides = sides.filter((side) => this.isSemiDirectedAtSide(side))
    if (semiDirSides.length < 2) return false
    if (semiDirSides.length >= 3) return true
    const [side1, side2] = semiDirSides
    return isAdjacentSides(side1, side2)
  })

  /**
   * Returns whether the mino is directed, that is,
   * there is some square in the mino such that all other squares
   * can be reached from that mino by going in two orthogonal directions.
   */
  isDirected = once(() => {
    return this.anchors().some((anchor) => this.isDirectedAtAnchor(anchor))
  })

  /** Return whether this mino is a bar chart polyomino */
  isBar() {
    if (!this.isSemiConvex()) return false
    return hasAdjacentAnchors(this.directedAnchors())
  }

  isDirectedConvex() {
    return this.isConvex() && this.anchors().length >= 1
  }

  /** Return true if this mino is a stairase polyomino */
  isStaircase() {
    return this.isConvex() && hasOppositeAnchors(this.anchors())
  }

  /** Return whether this mino is a stack polyomino */
  isStack() {
    return this.isConvex() && hasAdjacentAnchors(this.anchors())
  }

  /** Return whether this polyomino is a Ferrers diagram */
  isFerrers() {
    return this.isConvex() && this.anchors().length >= 3
  }

  /** Return whether this polyomino is a rectangle */
  isRectangle() {
    return this.isConvex() && this.anchors().length === 4
  }
}

function hasAdjacentAnchors(anchors: Anchor[]) {
  if (anchors.length > 2) return true
  if (anchors.length < 2) return false
  const [first, second] = anchors
  return first.x === second.x || first.y === second.y
}

function hasOppositeAnchors(anchors: Anchor[]) {
  if (anchors.length > 2) return true
  if (anchors.length < 2) return false
  const [first, second] = anchors
  return first.x !== second.x && first.y !== second.y
}

function getDirectionsForSide(side: Side) {
  const vecs = [Vector.UP, Vector.DOWN, Vector.LEFT, Vector.RIGHT]
  const sideVecs = {
    left: Vector.LEFT,
    right: Vector.RIGHT,
    top: Vector.UP,
    bottom: Vector.DOWN,
  }
  return vecs.filter((v) => !v.equals(sideVecs[side]))
}

function getAxis(side: Side): Axis {
  switch (side) {
    case "top":
    case "bottom":
      return "column"
    case "left":
    case "right":
      return "row"
  }
}

function isOppositeSides(side1: Side, side2: Side) {
  return getAxis(side1) === getAxis(side2)
}

function isAdjacentSides(side1: Side, side2: Side) {
  return !isOppositeSides(side1, side2)
}
