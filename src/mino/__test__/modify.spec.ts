import { fromString } from "../data"
import { addSquare, removeSquare } from "../modify"
describe("modify", () => {
  describe("addSquare", () => {
    // L tetromino
    const mino = fromString("100_111")
    it("works correctly on an inner coordinate", () => {
      expect(addSquare(mino, [1, 1])).toEqual(fromString("110_111"))
    })

    it("works correctly when i < 0", () => {
      expect(addSquare(mino, [-1, 0])).toEqual(fromString("100_111_001"))
    })

    it("works correctly when j < 0", () => {
      expect(addSquare(mino, [0, -1])).toEqual(fromString("1000_1111"))
    })

    it("works correctly when j === width", () => {
      expect(addSquare(mino, [0, 3])).toEqual(fromString("0100_1111"))
    })
  })

  describe("removeSquare", () => {
    // X pentomino
    const mino = fromString("010_111_010")
    it("works correctly when adjustments not needed", () => {
      expect(removeSquare(mino, [2, 1])).toEqual(fromString("111_010"))
    })

    it("works correctly when a downshift is needed", () => {
      expect(removeSquare(mino, [0, 1])).toEqual(fromString("010_111"))
    })

    it("works correctly when left shift is needed", () => {
      expect(removeSquare(mino, [1, 0])).toEqual(fromString("01_11_01"))
    })

    it("works correctly when decreasing width is needed", () => {
      expect(removeSquare(mino, [1, 2])).toEqual(fromString("10_11_10"))
    })
  })
})
