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
})
