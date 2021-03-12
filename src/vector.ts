/**
 * A 2D vector class
 */
export default class Vector {
  readonly x: number
  readonly y: number

  static readonly ZERO = new Vector(0, 0)
  static readonly LEFT = new Vector(-1, 0)
  static readonly RIGHT = new Vector(1, 0)
  static readonly DOWN = new Vector(0, 1)
  static readonly UP = new Vector(0, -1)

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

  toArray(): [number, number] {
    return [this.x, this.y]
  }

  toString() {
    return this.toArray().toString()
  }

  *[Symbol.iterator](): Generator<number> {
    yield this.x
    yield this.y
  }

  /** Return whether this vector is equal to the provided other vector */
  equals(v: Vector) {
    return this.x === v.x && this.y === v.y
  }

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
