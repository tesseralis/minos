import Polyomino from "../Polyomino"

describe("mino", () => {
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
      const expected = [
        [0, 0],
        [0, 3],
        [1, 3],
        [1, 1],
        [2, 1],
        [2, 0],
      ]
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
      const expected = [
        [0, 0],
        [0, 2],
        [1, 2],
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 2],
        [3, 0],
      ]
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
      const expected = [
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
      ]
      expect(mino.outline()).toEqual(expected)
    })
  })
})
