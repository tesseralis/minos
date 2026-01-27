import { range } from "lodash-es"
import Vector from "$lib/vector"
import PointSet from "$lib/PointSet"
import {
  type Polyomino,
  type Anchor,
  getAnchors,
  DirClass,
  type Level,
} from "./internal"
import {
  getNeighbors,
  getKingwiseNeighbors,
  type PackedPoint,
  encode,
  px,
  py,
  type Direction,
  move,
} from "./data"

const axes = ["row", "column"] as const
type Axis = (typeof axes)[number]
const sides = ["top", "left", "bottom", "right"] as const
type Side = (typeof sides)[number]

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
  get() {
    const dirDiags = this.anchors().filter((anchor) =>
      this.isCornerDirected(anchor),
    )
    let diag: Level
    if (dirDiags.length === 2) {
      diag = `2-${hasOppositeAnchors(dirDiags) ? "trans" : "cis"}`
    } else {
      diag = dirDiags.length as Level
    }
    // `isSemiDirectedAtSide` is more expensive, so short circuit if we can
    if (dirDiags.length > 2 || diag === "2-trans") {
      return new DirClass(4, diag)
    }
    const anchorSides = dirDiags.flatMap(getSidesForAnchor)
    const dirSides = sides.filter((side) => {
      if (anchorSides.includes(side)) return true
      return this.isSideDirected(side)
    })
    let ortho: Level
    if (dirSides.length === 2) {
      const [first, second] = dirSides
      ortho = `2-${isOppositeSides(first, second) ? "trans" : "cis"}`
    } else {
      ortho = dirSides.length as Level
    }

    return new DirClass(ortho, diag)
  }

  // Get the point of this polyomino's bounding box at the given corner anchor
  private pointAtAnchor({ x, y }: Anchor) {
    const [w, h] = this.mino.dims
    const xCoord = x === "start" ? 0 : w - 1
    const yCoord = y === "start" ? 0 : h - 1
    return encode(xCoord, yCoord)
  }

  // Check if the cells on the border of a given side are a connected series of points.
  // If so, return one of them, otherwise return undefined
  private checkPointsAtSide(side: Side): PackedPoint | undefined {
    const [w, h] = this.mino.dims
    switch (side) {
      case "right":
      case "left": {
        const xCoord = side === "left" ? 0 : w - 1
        let point
        let foundHole = false
        for (const j of range(h)) {
          if (this.mino.has(xCoord, j)) {
            if (foundHole) {
              return undefined
            }
            point = encode(xCoord, j)
          } else if (point) {
            foundHole = true
          }
        }
        return point
      }
      case "top":
      case "bottom": {
        const yCoord = side === "top" ? 0 : h - 1
        let point
        let foundHole = false
        for (const i of range(w)) {
          if (this.mino.has(i, yCoord)) {
            if (foundHole) {
              return undefined
            }
            point = encode(i, yCoord)
          } else if (point) {
            foundHole = true
          }
        }
        return point
      }
    }
  }

  /** Return whether the polyomino has the given anchor */
  hasAnchor(anchor: Anchor) {
    return this.mino.hasRaw(this.pointAtAnchor(anchor))
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
  isSemiConvex() {
    return axes.some((axis) => this.isConvexAtAxis(axis))
  }

  /**
   * Return true if this polyomino is a "crescent"
   * (i.e. has a concavity in at most one direction)
   */
  isCrescent() {
    return sides.filter((side) => this.isSideDirected(side)).length >= 3
  }

  /**
   * Return whether this polyomino is convex,
   * that is, whether there are no "gaps"
   * between squares within the same row or coloumn.
   */
  isConvex() {
    return axes.every((axis) => this.isConvexAtAxis(axis))
  }

  /**
   * Return true if the polyomino has a puncture.
   */
  punctures() {
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
  }

  /** Return whether the polyomino contains a hole */
  hasHole() {
    // First mino with a hole is a heptomino
    if (this.mino.order < 7) {
      return false
    }
    // TODO this will fail for holes larger than a single cell
    for (const x of range(1, this.mino.width - 1)) {
      for (const y of range(1, this.mino.height - 1)) {
        // Has a hole if there is a point inside the mino that isn't contained in the mino
        // but its neighbors are all in the mino.
        // Note: this only works for order <= 8
        const p = new Vector(x, y)
        if (this.mino.contains(p)) {
          continue
        }
        const nbrs = [...getNeighbors(p)]
        if (nbrs.every((nbr) => this.mino.contains(nbr))) {
          return true
        }
      }
    }
    return false
  }

  // Get all the corner points of this polyomino that are contained in it
  private *iterAnchors(): Generator<Anchor> {
    for (const anchor of getAnchors()) {
      if (this.hasAnchor(anchor)) {
        yield anchor
      }
    }
  }

  /** Return all the contained anchors of this polyomino */
  anchors() {
    return [...this.iterAnchors()]
  }

  /** Returns whether the polyomino is directed at the given anchor */
  isSideDirected(dir: Side) {
    // Get the three dimensions for the side
    const directions = getDirectionsForSide(dir)
    const start = this.checkPointsAtSide(dir)
    if (start === undefined) {
      return false
    }
    // Do BFS in three orthogonal directions
    const visited = new Set<PackedPoint>()
    visited.add(start)
    const stack = [start]
    while (stack.length > 0) {
      const current = stack.pop()!
      for (const nbrDir of directions) {
        if (nbrDir === "up" && py(current) === 0) continue
        if (nbrDir === "left" && px(current) === 0) continue
        const nbr = move(current, nbrDir)
        if (nbr !== undefined && this.mino.hasRaw(nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          stack.push(nbr)
        }
      }
    }
    // If at the end, we visited all cells, it's semi-directed
    return visited.size === this.mino.order
  }

  /** Returns whether the polyomino is directed at the given anchor */
  isCornerDirected(corner: Anchor) {
    if (!this.hasAnchor(corner)) {
      return false
    }
    // Get the two directions of that corner
    const xDir: Direction = corner.x === "end" ? "left" : "right"
    const yDir: Direction = corner.y === "end" ? "up" : "down"
    const start = this.pointAtAnchor(corner)
    // Do BFS in the two orthogonal directions
    const visited = new Set<PackedPoint>()
    visited.add(start)
    const queue = [start]
    while (queue.length > 0) {
      const current = queue.pop()!
      for (const nbrDir of [yDir, xDir]) {
        const nbr = move(current, nbrDir)
        if (nbr !== undefined && this.mino.hasRaw(nbr) && !visited.has(nbr)) {
          visited.add(nbr)
          queue.push(nbr)
        }
      }
    }
    // If at the end, we visited all cells, it's directed
    return visited.size === this.mino.order
  }

  /** Return all the anchors that this polyomino is directed at */
  directedAnchors() {
    return this.anchors().filter((anchor) => this.isCornerDirected(anchor))
  }

  /**
   * Returns whether the mino is semi-directed (aka orthogonally directed),
   * that is, there is some square in the mino such that all the other squares
   * can be reached from that mino in going three directions but not the fourth
   */
  isSemiDirected() {
    return sides.some((side) => this.isSideDirected(side))
  }

  /**
   * Return whether the mino is pre-directed, that is,
   * if it is semi-directed with respect to two adjacent directions.
   */
  isPreDirected() {
    const semiDirSides = sides.filter((side) => this.isSideDirected(side))
    if (semiDirSides.length < 2) return false
    if (semiDirSides.length >= 3) return true
    const [side1, side2] = semiDirSides
    return isAdjacentSides(side1, side2)
  }

  /**
   * Returns whether the mino is directed, that is,
   * there is some square in the mino such that all other squares
   * can be reached from that mino by going in two orthogonal directions.
   */
  isDirected() {
    return this.anchors().some((anchor) => this.isCornerDirected(anchor))
  }

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

function getSidesForAnchor(anchor: Anchor): Side[] {
  return [
    anchor.x === "end" ? "right" : "left",
    anchor.y === "end" ? "bottom" : "top",
  ]
}

function getDirectionsForSide(side: Side) {
  return sides.filter((s) => s !== side).map(sideToDirection)
}

function sideToDirection(side: Side): Direction {
  switch (side) {
    case "top":
      return "up"
    case "bottom":
      return "down"
    default:
      return side
  }
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
