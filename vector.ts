/** An unwrapped vector */
export type Point = [number, number]

export type VectorLike = Point | Vector

/**
 * A 2D vector class
 */
export default class Vector {
  readonly x: number
  readonly y: number

  // The zero vector
  static readonly ZERO = new Vector(0, 0)

  // Constants for cardinal directions
  static readonly LEFT = new Vector(-1, 0)
  static readonly RIGHT = new Vector(1, 0)
  static readonly DOWN = new Vector(0, 1)
  static readonly UP = new Vector(0, -1)

  // Constructors and factories

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static fromArray([x, y]: Point) {
    return new Vector(x, y)
  }

  static of(v: VectorLike) {
    if (v instanceof Vector) {
      return v
    }
    return Vector.fromArray(v)
  }

  /**
   * Convert the given polar coordinate to Cartesian
   */
  static fromPolar(radius: number, angle: number) {
    return new Vector(radius * Math.sin(angle), radius * -Math.cos(angle))
  }

  // Casting

  toArray(): Point {
    return [this.x, this.y]
  }

  toString() {
    return this.toArray().toString()
  }

  // Implement iterator protocol so a vector can be destructured, i.e.
  // const [x, y] = new Vector(0, 0)
  *[Symbol.iterator](): Generator<number> {
    yield this.x
    yield this.y
  }

  /** Return whether this vector is equal to the provided other vector */
  equals([x, y]: VectorLike) {
    return this.x === x && this.y === y
  }

  // Operations

  /** Return the inverse of this vector */
  inverse() {
    return new Vector(-this.x, -this.y)
  }

  /** Scale (multiply) this vector by s */
  scale(s: number) {
    return new Vector(this.x * s, this.y * s)
  }

  /** Add the given vector to this vector */
  add([x, y]: VectorLike) {
    return new Vector(this.x + x, this.y + y)
  }

  /** Subtract the given vector from this vector */
  sub([x, y]: VectorLike) {
    return new Vector(this.x - x, this.y - y)
  }

  /** Get the signed angle from this vector to the provided vector */
  angleTo([x, y]: VectorLike) {
    return Math.atan2(y - this.y, x - this.x)
  }
}
