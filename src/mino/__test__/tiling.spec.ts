import { Polyomino } from "mino"
import { getTiling } from "../tiling"

// TODO (test) make sure translating by the basis gives something adjacent
// TODO (test) make sure domains are connected but don't overlap
describe("getTiling()", () => {
  it("returns the tiling for translation criteria minos", () => {
    const mino = Polyomino.fromString("111_100")
    expect(getTiling(mino)).not.toBeUndefined()
  })

  it("returns the tiling for conway criterion minos", () => {
    const mino = Polyomino.fromString("111_010_010")
    expect(getTiling(mino)).not.toBeUndefined()
  })

  it("returns the tiling for a translation pair mino", () => {
    const mino = Polyomino.fromString("1001_1111_0010")
    expect(getTiling(mino)).not.toBeUndefined()
  })

  it("returns a tiling for a Conway pair mino", () => {
    const mino = Polyomino.fromString("11111_01001")
    expect(getTiling(mino)).not.toBeUndefined()
  })

  it("returns a tiling for Conway pair mino with AD of length zero", () => {
    const mino = Polyomino.fromString("0010_0111_0100_1100")
    expect(getTiling(mino)).not.toBeUndefined()
  })

  it("does not return a tiling when none is possible", () => {
    const mino = Polyomino.fromString("111_101_110")
    expect(getTiling(mino)).toBeUndefined()
  })
})
