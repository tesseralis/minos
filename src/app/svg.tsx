import React from "react"
import { Point } from "math"
export type { Point } from "math"

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

export function svgTransform() {
  return new SVGTransform()
}

export interface LineProps
  extends Omit<
    React.SVGProps<SVGLineElement>,
    "x1" | "x2" | "y1" | "y2" | "transform"
  > {
  p1: Point
  p2: Point
  transform?: SVGTransform
}

export function Line({ p1, p2, transform, ...svgProps }: LineProps) {
  return (
    <line
      {...svgProps}
      x1={p1[0]}
      y1={p1[1]}
      x2={p2[0]}
      y2={p2[1]}
      transform={transform?.toString()}
    />
  )
}

export interface PolygonProps
  extends Omit<React.SVGProps<SVGPolygonElement>, "points" | "transform"> {
  points: readonly Point[]
  transform?: SVGTransform
}

export function Polygon({ points, transform, ...svgProps }: PolygonProps) {
  return (
    <polygon
      {...svgProps}
      points={points.map((p) => p.join(",")).join(" ")}
      transform={transform?.toString()}
    />
  )
}
