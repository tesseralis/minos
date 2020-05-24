export type Point = readonly [number, number]

// A polar coordinate
export interface Polar {
  radius: number
  angle: number
}

export interface Circle {
  center: Point
  radius: number
}

export const PRECISION = 0.0001

export const TAU = 2 * Math.PI

/**
 * Tests whether the two numbers are equal up to a precision.
 */
export function equalsToPrecision(
  n1: number,
  n2: number,
  precision: number = PRECISION,
) {
  return Math.abs(n1 - n2) < precision
}

/**
 * Convert the given polar coordinate to Cartesian
 */
export function toCartesian({ radius, angle }: Polar): Point {
  return [radius * Math.sin(angle), radius * -Math.cos(angle)]
}

/**
 * Get the signed angle formed by line segments made by the two points and the origin.
 */
export function getPointAngle([x0, y0]: Point, [x1, y1]: Point) {
  return Math.atan2(y1 - y0, x1 - x0)
}

/**
 * Get the determinant of the 2x2 matrix
 */
export function det2([[x1, x2], [x3, x4]]: any) {
  return x1 * x4 - x2 * x3
}

/**
 * Get the determinant of the 3x3 matrix
 */
export function det3([[x1, x2, x3], [x4, x5, x6], [x7, x8, x9]]: any) {
  return (
    x1 *
      det2([
        [x5, x6],
        [x8, x9],
      ]) -
    x2 *
      det2([
        [x4, x6],
        [x7, x9],
      ]) +
    x3 *
      det2([
        [x4, x5],
        [x7, x8],
      ])
  )
}

export function sumOfSq(x1: number, x2: number) {
  return x1 ** 2 + x2 ** 2
}

/**
 * Get the circle passing through the three given points.
 *
 * http://www.ambrsoft.com/trigocalc/circle3d.htm
 */
export function getCircleFromPoints(
  [x1, y1]: Point,
  [x2, y2]: Point,
  [x3, y3]: Point,
): Circle {
  const A = det3([
    [x1, y1, 1],
    [x2, y2, 1],
    [x3, y3, 1],
  ])
  const d1 = sumOfSq(x1, y1)
  const d2 = sumOfSq(x2, y2)
  const d3 = sumOfSq(x3, y3)
  const B = -det3([
    [d1, y1, 1],
    [d2, y2, 1],
    [d3, y3, 1],
  ])
  const C = det3([
    [d1, x1, 1],
    [d2, x2, 1],
    [d3, x3, 1],
  ])
  const D = -det3([
    [d1, x1, y1],
    [d2, x2, y2],
    [d3, x3, y3],
  ])
  const center: Point = [-B / (2 * A), -C / (2 * A)]
  const radius = Math.sqrt((B ** 2 + C ** 2 - 4 * A * D) / (4 * A ** 2))
  return { center, radius }
}
