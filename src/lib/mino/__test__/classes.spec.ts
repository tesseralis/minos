import { describe, it, expect } from "vitest"
import { Polyomino } from "../internal"

describe("MinoClasses", () => {
  describe(".isConvex()", () => {
    it("returns true for convex polyominoes", () => {
      const cases = ["11111", "0100_1111_0100", "110_011_001"].map(
        Polyomino.fromString,
      )
      for (const mino of cases) {
        expect(mino.classes.isConvex()).toBe(true)
      }
    })

    it("returns false for concave polyominoes", () => {
      const cases = [
        "111_101",
        "11_10_11",
        "111_101_110",
        "1010_1111_0101",
        "11_10_10_11_10",
      ].map(Polyomino.fromString)
      for (const mino of cases) {
        expect(mino.classes.isConvex()).toBe(false)
      }
    })
  })

  describe("isDirected", () => {
    it("works for positive cases", () => {
      const cases = ["11", "011_110", "0111_1101"].map(Polyomino.fromString)
      for (const mino of cases) {
        expect(mino.classes.isDirected()).toBe(true)
      }
    })

    it("works for negative cases", () => {
      const cases = ["010_111_010", "110_011_110", "011_101_111_010"].map(
        Polyomino.fromString,
      )
      for (const mino of cases) {
        expect(mino.classes.isDirected()).toBe(false)
      }
    })
  })

  describe("isBarChart", () => {
    it("works on positive cases", () => {
      const cases = ["11_10_11", "1111", "110_111_100"].map(
        Polyomino.fromString,
      )
      for (const mino of cases) {
        expect(mino.classes.isBar()).toBe(true)
      }
    })
    it("works on negative cases", () => {
      const cases = ["100_111_001", "0111_1101"].map(Polyomino.fromString)
      for (const mino of cases) {
        expect(mino.classes.isBar()).toBe(false)
      }
    })
  })

  describe("getDirClass", () => {
    it("works", () => {
      const mino = Polyomino.of("11011_01110")
      expect(mino.classes.get().name()).toEqual("crescent")
    })
  })
})
