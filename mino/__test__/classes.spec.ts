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

  describe(".punctures()", () => {
    it("returns the right amount for true cases", () => {
      const cases: [string, number][] = [
        ["111_101_111", 1],
        ["111_101_111_101_110", 1],
        ["111_101_111_101_111", 2],
      ]
      for (const [mino, expected] of cases) {
        expect(Polyomino.of(mino).classes.punctures().length).toBe(expected)
      }
    })

    it("returns correctly for minos without punctures", () => {
      const cases = ["111_100_111", "111_101_110"].map((str) =>
        Polyomino.of(str),
      )
      for (const mino of cases) {
        expect(mino.classes.punctures().length).toBe(0)
      }
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
        expect(mino.classes.hasHole()).toBe(true)
      }
    })

    it("returns false for non-holey cases", () => {
      const cases = ["111_111_110", "111_101", "010_111_010"].map((str) =>
        Polyomino.fromString(str),
      )
      for (const mino of cases) {
        expect(mino.classes.hasHole()).toBe(false)
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
})
