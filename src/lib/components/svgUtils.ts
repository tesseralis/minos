import Vector from "$lib/vector"

// SVGs can accept either arrays or vectors for point coordinates
export type Point = Vector | readonly [number, number]
export type { Instance as Color } from "tinycolor2"

export class SVGTransform {
  #result = ""

  translate(x: number, y: number): this {
    this.#result = `translate(${x} ${y}) ${this.#result}`
    return this
  }

  rotate(angle: number): this {
    this.#result = `rotate(${angle}) ${this.#result}`
    return this
  }

  toString() {
    return this.#result
  }
}

/**
 * an SVG transform with a fluent API
 */
export function svgTransform() {
  return new SVGTransform()
}

export function onHover(cb?: (hovered: boolean) => void) {
  if (!cb) {
    return {}
  }
  return {
    onpointerenter: cb ? () => cb(true) : undefined,
    onpointerleave: cb ? () => cb(false) : undefined,
    // Key events to accompany pointer events
    onfocus: cb ? () => cb(true) : undefined,
    onblur: cb ? () => cb(false) : undefined,
  }
}

/** Rect, text x, y attributes */
export function point([x, y]: Point) {
  return { x, y }
}

/** Circle cx, cy attributes */
export function center([cx, cy]: Point) {
  return { cx, cy }
}

/** Line x1, y1, x2, y2 attributes */
export function endpoints([x1, y1]: Point, [x2, y2]: Point) {
  return { x1, y1, x2, y2 }
}

/** Polyline and polygon `points` string */
export function getPoints(points: Point[]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ")
}
