import { once, range } from "lodash-es"
import Vector from "vector"
import PointSet from "PointSet"
import { Polyomino, Anchor, getAnchors, getNeighbors } from "./internal"

const axes = ["row", "column"] as const
type Axis = typeof axes[number]

export const minoClasses = [
  "rectangle",
  "ferrersGraph",
  "staircase",
  "stack",
  "directedConvex",
  "barGraph",
  "convex",
  "directedSemiConvex",
  "semiConvex",
  "directed",
  "other",
] as const

export type MinoClass = typeof minoClasses[number]

/**
 * Predicates for testing whether a mino belongs into one of the
 * specially defined classes of polyominoes, like directed minos.
 */
export default class MinoClasses {
  private mino: Polyomino

  constructor(mino: Polyomino) {
    this.mino = mino
  }

  // Get the point of this polyomino's bounding box at the given corner anchor
  private pointAtAnchor({ x, y }: Anchor) {
    const [w, h] = this.mino.dims
    const xCoord = x === "start" ? 0 : w - 1
    const yCoord = y === "start" ? 0 : h - 1
    return new Vector(xCoord, yCoord)
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
   * Return whether this polyomino is convex,
   * that is, whether there are no "gaps"
   * between squares within the same row or coloumn.
   */
  isConvex = once(() => {
    return axes.every((axis) => this.isConvexAtAxis(axis))
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

  /** Get the highest class in the class hierarchy that this mino is in */
  best(): MinoClass {
    if (this.isRectangle()) {
      return "rectangle"
    } else if (this.isFerrers()) {
      return "ferrersGraph"
    } else if (this.isStack()) {
      return "stack"
    } else if (this.isStaircase()) {
      return "staircase"
    } else if (this.isDirectedConvex()) {
      return "directedConvex"
    } else if (this.isBar()) {
      return "barGraph"
    } else if (this.isConvex()) {
      return "convex"
    } else if (this.isSemiConvex() && this.isDirected()) {
      return "directedSemiConvex"
    } else if (this.isSemiConvex()) {
      return "semiConvex"
    } else if (this.isDirected()) {
      return "directed"
    } else {
      return "other"
    }
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
