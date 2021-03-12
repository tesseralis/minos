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

  toArray(): [number, number] {
    return [this.x, this.y]
  }

  equals(v: Vector) {
    return this.x === v.x && this.y === v.y
  }

  inverse() {
    return new Vector(-this.x, -this.y)
  }

  scale(s: number) {
    return new Vector(this.x * s, this.y * s)
  }

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  sub(v: Vector) {
    return this.add(v.inverse())
  }
}
