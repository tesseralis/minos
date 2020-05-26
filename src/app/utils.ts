import {
  Point,
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
