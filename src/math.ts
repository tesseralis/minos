import Vector from "vector"

export interface Circle {
  center: Vector
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
  v1: Vector,
  v2: Vector,
  v3: Vector,
): Circle {
  const A = det3([
    [v1.x, v1.y, 1],
    [v2.x, v2.y, 1],
    [v3.x, v3.y, 1],
  ])
  const d1 = sumOfSq(v1.x, v1.y)
  const d2 = sumOfSq(v2.x, v2.y)
  const d3 = sumOfSq(v3.x, v3.y)
  const B = -det3([
    [d1, v1.y, 1],
    [d2, v2.y, 1],
    [d3, v3.y, 1],
  ])
  const C = det3([
    [d1, v1.x, 1],
    [d2, v2.x, 1],
    [d3, v3.x, 1],
  ])
  const D = -det3([
    [d1, v1.x, v1.y],
    [d2, v2.x, v2.y],
    [d3, v3.x, v3.y],
  ])
  const center = new Vector(-B / (2 * A), -C / (2 * A))
  const radius = Math.sqrt((B ** 2 + C ** 2 - 4 * A * D) / (4 * A ** 2))
  return { center, radius }
}
