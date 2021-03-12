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

  /**
   * Convert the given polar coordinate to Cartesian
   */
  static fromPolar(radius: number, angle: number) {
    return new Vector(radius * Math.sin(angle), radius * -Math.cos(angle))
  }

  // Casting

  toArray(): [number, number] {
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
  equals(v: Vector) {
    return this.x === v.x && this.y === v.y
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
  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  /** Subtract the given vector from this vector */
  sub(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  /** Get the signed angle from this vector to the provided vector */
  angleTo(v: Vector) {
    return Math.atan2(v.y - this.y, v.x - this.x)
  }
}
