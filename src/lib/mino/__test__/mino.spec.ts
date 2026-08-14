import { describe, it, expect } from "vitest"
import { Polyomino } from ".."

describe("mino", () => {
  describe("strings", () => {
    it("properly converts to and from string", () => {
      const sampleStrings = ["1", "11", "111_100_111", "1010_1111_0101"]
      for (const string of sampleStrings) {
        const mino = Polyomino.fromString(string)
        expect(mino.toString()).toEqual(string)
      }
    })
  })

  describe("order", () => {
    it("correctly gets mino size", () => {
      const minos = [
        Polyomino.fromString("1"),
        Polyomino.fromString("11"),
        Polyomino.fromString("11_01"),
        Polyomino.fromString("111_001"),
        Polyomino.fromString("010_111_010"),
      ]
      minos.forEach((mino, i) => {
        expect(mino.order).toEqual(i + 1)
      })
    })
  })

  describe("fromCoords", () => {
    it("correctly creates an L tetromino", () => {
      const actual = Polyomino.fromCoords([
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ])
      const expected = Polyomino.fromString("11_01_01")
      expect(actual).toEqual(expected)
    })
  })

  describe("longestWave", () => {
    it("works", () => {
      const mino = Polyomino.fromString("111_100_100")
      expect(mino.longestWave().max).toEqual(3)
    })
  })

  describe(".hasHole()", () => {
    it("returns true for all holey cases", () => {
      const cases = [
        "111_101_110",
        "111_101_111",
        "0111_0101_1110",
        "0111_1101_0110",
      ].map(Polyomino.fromString)
      for (const mino of cases) {
        expect(mino.hasHole()).toBeTruthy()
      }
    })

    it("returns false for non-holey cases", () => {
      const cases = ["111_111_110", "111_101", "010_111_010"].map((str) =>
        Polyomino.fromString(str),
      )
      for (const mino of cases) {
        expect(mino.hasHole()).toBeFalsy()
      }
    })

    it("works for holes bigger than one cell", () => {
      const mino = Polyomino.fromString("1111_1001_1110")
      expect(mino.hasHole()).toBeTruthy()
    })
  })

  describe(".punctures()", () => {
    it("works for multi-hole minos", () => {
      const mino = Polyomino.fromString("111_101_101_111")
      expect(mino.punctures().toArray()[0]).toHaveLength(2)
    })
  })
})
