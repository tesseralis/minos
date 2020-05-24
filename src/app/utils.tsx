import React from "react"
import type { Point } from "math"
import {
  TAU,
  equalsToPrecision,
  getPointAngle,
  getCircleFromPoints,
} from "math"
import { path as d3path } from "d3-path"
import { scaleLinear } from "d3-scale"

interface AngleScaleOptions {
  spread: number
  start: number
  count: number
  reverse?: boolean
}

/**
 * Get the scale that takes an index and returns an angle
 *
 * @param spread the maximum spread, in turns
 * @param start the start angle to "fan out" the spread, in turns
 * @param count how many items are in the collection to derive angles for
 * @param reverse whether the range should be reversed
 * so that lower indices have higher angles
 */
export function getAngleScale({
  spread,
  start,
  count,
  reverse = false,
}: AngleScaleOptions) {
  const angleStart = start + (1 / 2 - spread) / 2
  const range = [TAU * angleStart, TAU * (angleStart + spread)]
  if (reverse) range.reverse()

  return scaleLinear()
    .domain([0, count - 1])
    .range(range)
}

/**
 * Get the path of the circular arc connecting `src` to `tgt`
 * that also passes through `base`.
 */
export function getArc(src: Point, tgt: Point, origin: Point) {
  // Special case: If we're colinear, just draw a straight line
  if (
    equalsToPrecision(getPointAngle(origin, src), getPointAngle(origin, tgt))
  ) {
    const path = d3path()
    path.moveTo(...src)
    path.lineTo(...tgt)
    return path.toString()
  }

  const { radius, center } = getCircleFromPoints(src, tgt, origin)
  const ccw = getPointAngle(origin, src) > getPointAngle(origin, tgt)

  const path = d3path()
  path.moveTo(...src)
  path.arc(
    center[0],
    center[1],
    radius,
    getPointAngle(center, src),
    getPointAngle(center, tgt),
    ccw,
  )
  return path.toString()
}

function getCoordAnchor(ns: number[], anchor: string) {
  const min = Math.min(...ns)
  const max = Math.max(...ns)

  switch (anchor) {
    case "left":
    case "top":
    case "start":
      return min
    case "right":
    case "bottom":
    case "end":
      return max
    case "center":
      return (min + max) / 2
    default:
      throw new Error("invalid anchor")
  }
}

// TODO better typing for anchors
/**
 * Gets the "anchor" point given a list of points and anchor string
 */
export function getAnchor(points: Point[], anchor: string) {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])

  const [yAnchor, xAnchor = yAnchor] = anchor.split(" ")
  return [getCoordAnchor(xs, xAnchor), getCoordAnchor(ys, yAnchor)]
}

interface LineProps
  extends Omit<React.SVGProps<SVGLineElement>, "x1" | "x2" | "y1" | "y2"> {
  p1: Point
  p2: Point
}

export function Line({ p1, p2, ...svgProps }: LineProps) {
  return <line {...svgProps} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />
}

interface PolygonProps
  extends Omit<React.SVGProps<SVGPolygonElement>, "points"> {
  points: readonly Point[]
}

export function Polygon({ points, ...svgProps }: PolygonProps) {
  return (
    <polygon {...svgProps} points={points.map((p) => p.join(",")).join(" ")} />
  )
}

class SVGTransformBuilder {
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
  return new SVGTransformBuilder()
}
