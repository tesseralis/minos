import { getMino } from "../mino"
import { addSquare, removeSquare } from "../modify"
describe("modify", () => {
  describe("addSquare", () => {
    // L tetromino
    const mino = getMino(0b100_111, 3)
    it("works correctly on an inner point", () => {
      expect(addSquare(mino, [1, 1])).toEqual(getMino(0b110_111, 3))
    })

    it("works correctly when i < 0", () => {
      expect(addSquare(mino, [-1, 0])).toEqual(getMino(0b100_111_001, 3))
    })

    it("works correctly when j < 0", () => {
      expect(addSquare(mino, [0, -1])).toEqual(getMino(0b1000_1111, 4))
    })

    it("works correctly when j === width", () => {
      expect(addSquare(mino, [0, 3])).toEqual(getMino(0b0100_1111, 4))
    })
  })

  describe("removeSquare", () => {
    // X pentomino
    const mino = getMino(0b010_111_010, 3)
    it("works correctly when adjustments not needed", () => {
      expect(removeSquare(mino, [2, 1])).toEqual(getMino(0b111_010, 3))
    })

    it("works correctly when a downshift is needed", () => {
      expect(removeSquare(mino, [0, 1])).toEqual(getMino(0b010_111, 3))
    })

    it("works correctly when left shift is needed", () => {
      expect(removeSquare(mino, [1, 0])).toEqual(getMino(0b01_11_01, 2))
    })

    it("works correctly when decreasing width is needed", () => {
      expect(removeSquare(mino, [1, 2])).toEqual(getMino(0b10_11_10, 2))
    })
  })
})
