import Vector from "vector"
import { Polyomino } from ".."

// TODO remove the need for these testing functions
function toVecs(coords: [number, number][]) {
  return coords.map(Vector.fromArray)
}

describe("mino", () => {
  describe("strings", () => {
    const sampleStrings = ["1", "11", "111_100_111", "1010_1111_0101"]
    for (const string of sampleStrings) {
      const mino = Polyomino.fromString(string)
      expect(mino.toString()).toEqual(string)
    }
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
      const expected = Polyomino.fromString("10_10_11")
      expect(actual).toEqual(expected)
    })
  })

  describe("transforms", () => {
    it("generates the right transforms for the L mino", () => {
      // 111
      // 100
      const mino = Polyomino.fromString("111_100")
      const transforms = mino.transforms()
      expect(transforms).toEqual(
        expect.arrayContaining([
          mino,
          Polyomino.fromString("10_10_11"),
          Polyomino.fromString("001_111"),
          Polyomino.fromString("11_01_01"),
          Polyomino.fromString("100_111"),
          Polyomino.fromString("10_10_11"),
          Polyomino.fromString("01_01_11"),
          Polyomino.fromString("11_10_10"),
        ]),
      )
    })

    it("does not repeat transformations", () => {
      // The X pentomino
      const mino = Polyomino.fromString("010_111_010")
      expect(new Set(mino.transforms()).size).toEqual(1)
    })
  })

  describe("outline", () => {
    it("works on L tetromino", () => {
      const mino = Polyomino.fromCoords([
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 2],
      ])
      const expected = toVecs([
        [0, 0],
        [0, 3],
        [1, 3],
        [1, 1],
        [2, 1],
        [2, 0],
      ])
      expect(mino.outline()).toEqual(expected)
    })

    it("works with concave minos", () => {
      const mino = Polyomino.fromCoords([
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [2, 1],
      ])
      const expected = toVecs([
        [0, 0],
        [0, 2],
        [1, 2],
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 2],
        [3, 0],
      ])
      expect(mino.outline()).toEqual(expected)
    })

    it("works with minos with holes", () => {
      const mino = Polyomino.fromCoords([
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [2, 1],
        [0, 2],
        [1, 2],
      ])
      const expected = toVecs([
        [0, 0],
        [0, 3],
        [2, 3],
        [2, 2],
        [1, 2],
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 2],
        [3, 0],
      ])
      expect(mino.outline()).toEqual(expected)
    })
  })

  describe(".isConvex()", () => {
    it("returns true for convex polyominoes", () => {
      const cases = ["11111", "0100_1111_0100", "110_011_001"].map(
        Polyomino.fromString,
      )
      for (const mino of cases) {
        expect(mino.isConvex()).toBe(true)
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
        expect(mino.isConvex()).toBe(false)
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
        expect(mino.hasHole()).toBe(true)
      }
    })

    it("returns false for non-holey cases", () => {
      const cases = ["111_111_110", "111_101", "010_111_010"].map((str) =>
        Polyomino.fromString(str),
      )
      for (const mino of cases) {
        expect(mino.hasHole()).toBe(false)
      }
    })
  })

  describe("isDirected", () => {
    it("works for positive cases", () => {
      const cases = ["11", "011_110", "0111_1101"].map(Polyomino.fromString)
      for (const mino of cases) {
        expect(mino.isDirected()).toBe(true)
      }
    })

    it("works for negative cases", () => {
      const cases = ["010_111_010", "110_011_110", "011_101_111_010"].map(
        Polyomino.fromString,
      )
      for (const mino of cases) {
        expect(mino.isDirected()).toBe(false)
      }
    })
  })

  describe("isBarChart", () => {
    it("works on positive cases", () => {
      const cases = ["11_10_11", "1111", "110_111_100"].map(
        Polyomino.fromString,
      )
      for (const mino of cases) {
        expect(mino.isBarChart()).toBe(true)
      }
    })
    it("works on negative cases", () => {
      const cases = ["100_111_001", "0111_1101"].map(Polyomino.fromString)
      for (const mino of cases) {
        expect(mino.isBarChart()).toBe(false)
      }
    })
  })
})
