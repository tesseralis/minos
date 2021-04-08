import { once, range } from "lodash-es"
import Vector from "vector"
import PointSet from "PointSet"
import { Polyomino, Anchor, getAnchors, getNeighbors } from "./internal"

const axes = ["row", "column"] as const
type Axis = typeof axes[number]

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

  private hasAnchor(anchor: Anchor) {
    return this.mino.contains(this.pointAtAnchor(anchor))
  }

  private isConvexAtAxis(axis: Axis) {
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
  private *getAnchors(): Generator<Anchor> {
    for (const anchor of getAnchors()) {
      if (this.hasAnchor(anchor)) {
        yield anchor
      }
    }
  }

  // Returns whether the polyomino is directed at the given anchor
  private isDirectedAtAnchor(anchor: Anchor) {
    // Get the two directions of that corner
    const xDir = anchor.x === "end" ? Vector.LEFT : Vector.RIGHT
    const yDir = anchor.y === "end" ? Vector.UP : Vector.DOWN
    const start = this.pointAtAnchor(anchor)
    // Do BFS in the two opposite directions
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

  /**
   * Returns whether the mino is directed, that is,
   * there is some square in the mino such that all other squares
   * can be reached from that mino by going in two orthogonal directions.
   */
  isDirected = once(() => {
    // Get the corner along with its associated direction
    for (const anchor of this.getAnchors()) {
      if (this.isDirectedAtAnchor(anchor)) {
        return true
      }
    }
    return false
  })

  /** Return whether this mino is a bar chart polyomino */
  isBarChart() {
    // Essentially, a bar chart mino is meta-bidirected
    const directedAnchors = [...getAnchors()].filter(
      (anchor) => this.hasAnchor(anchor) && this.isDirectedAtAnchor(anchor),
    )
    // If it's a higher class, return true
    if (directedAnchors.length >= 3) return true
    // If it's not bidirected, return false
    if (directedAnchors.length < 2) return false
    // Make sure the corners are next to each other
    const [first, second] = directedAnchors
    return first.x === second.x || first.y === second.y
  }

  // Return whether the polyomino contains two opposite corners of its bounding box
  private containsOppositeCorners() {
    return (
      (this.hasAnchor({ x: "start", y: "start" }) &&
        this.hasAnchor({ x: "end", y: "end" })) ||
      (this.hasAnchor({ x: "end", y: "start" }) &&
        this.hasAnchor({ x: "start", y: "end" }))
    )
  }

  /** Return true if this mino is a stairase polyomino */
  isStaircase() {
    return this.isConvex() && this.containsOppositeCorners()
  }

  /** Return whether this mino is a stack polyomino */
  isStack() {
    return this.isConvex() && this.isBarChart()
  }

  /** Return whether this polyomino is a Ferrers diagram */
  isFerrers() {
    return this.isConvex() && [...this.getAnchors()].length >= 3
  }

  /** Return whether this polyomino is a rectangle */
  isRectangle() {
    return this.isConvex() && [...this.getAnchors()].length === 4
  }
}
