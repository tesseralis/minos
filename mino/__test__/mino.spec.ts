import { Polyomino } from ".."

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
})
