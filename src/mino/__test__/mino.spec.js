import { getMino, getSize, fromPoints } from "../mino"

describe("mino", () => {
  describe("getSize", () => {
    it("correctly gets mino size", () => {
      const minos = [
        0,
        getMino(1, 1),
        getMino(0b11, 2),
        getMino(0b11_01, 2),
        getMino(0b111_001, 3),
        getMino(0b010_111_010, 3),
      ]
      minos.forEach((mino, i) => {
        expect(getSize(mino)).toEqual(i)
      })
    })
  })
  describe("fromPoints", () => {
    it("correctly creates an L tetromino", () => {
      const points = [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ]
      const expected = getMino(0b10_10_11, 2)
      expect(fromPoints(points)).toEqual(expected)
    })
  })
})
