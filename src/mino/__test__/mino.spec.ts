import { getMino, getSize, fromCoords, isValid, MONOMINO } from "../mino"

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
  describe("fromCoords", () => {
    it("correctly creates an L tetromino", () => {
      const coords = [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ] as any
      const expected = getMino(0b10_10_11, 2)
      expect(fromCoords(coords)).toEqual(expected)
    })
  })

  describe("isValid", () => {
    it("returns true for valid minos", () => {
      const testCases = [
        getMino(0b11_01, 2),
        getMino(0b010_111_001, 3),
        getMino(0b111_101_111, 3),
      ]
      for (const testCase of testCases) {
        expect(isValid(testCase)).toBeTruthy()
      }
    })

    it("returns true for the monomino", () => {
      expect(isValid(MONOMINO)).toBeTruthy()
    })

    it("returns false for the zero-mino", () => {
      expect(isValid(0)).toBeFalsy()
    })

    it("returns false for invalid minos", () => {
      const testCases = [
        getMino(0b101, 3),
        getMino(0b10_01, 2),
        getMino(0b011_101_110, 3),
      ]
      for (const testCase of testCases) {
        expect(isValid(testCase)).toBeFalsy()
      }
    })
  })
})
