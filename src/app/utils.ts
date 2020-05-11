import type { Point } from "math"
import { equalsToPrecision, getPointAngle, getCircleFromPoints } from "math"
import * as d3 from "d3-path"

/**
 * Get the path of the circular arc connecting `src` to `tgt`
 * that also passes through `base`.
 */
export function getArc(src: Point, tgt: Point, origin: Point) {
  // Special case: If we're colinear, just draw a straight line
  if (
    equalsToPrecision(getPointAngle(origin, src), getPointAngle(origin, tgt))
  ) {
    const path = d3.path()
    path.moveTo(...src)
    path.lineTo(...tgt)
    return path.toString()
  }

  const { radius, center } = getCircleFromPoints(src, tgt, origin)
  const ccw = getPointAngle(origin, src) > getPointAngle(origin, tgt)

  const path = d3.path()
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
