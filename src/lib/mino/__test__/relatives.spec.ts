import { describe, it, expect } from "vitest"
import { fromString, isValid, addSquare, removeSquare, encode } from "../data"

describe("modify", () => {
  describe("addSquare", () => {
    // L tetromino
    const mino = fromString("111_001")
    it("works correctly on an inner coordinate", () => {
      expect(addSquare(mino, encode(1, 1))).toEqual(fromString("111_011"))
    })

    it("works correctly when i < 0", () => {
      expect(addSquare(mino, encode(-1, 0))).toEqual(fromString("100_111_001"))
    })

    it("works correctly when j < 0", () => {
      expect(addSquare(mino, encode(0, -1))).toEqual(fromString("1111_0001"))
    })

    it("works correctly when j === width", () => {
      expect(addSquare(mino, encode(0, 3))).toEqual(fromString("1111_0010"))
    })
  })

  describe("removeSquare", () => {
    // X pentomino
    const mino = fromString("010_111_010")
    it("works correctly when adjustments not needed", () => {
      expect(removeSquare(mino, [2, 1])).toEqual(fromString("010_111"))
    })

    it("works correctly when a downshift is needed", () => {
      expect(removeSquare(mino, [0, 1])).toEqual(fromString("111_010"))
    })

    it("works correctly when left shift is needed", () => {
      expect(removeSquare(mino, [1, 0])).toEqual(fromString("10_11_10"))
    })

    it("works correctly when decreasing width is needed", () => {
      expect(removeSquare(mino, [1, 2])).toEqual(fromString("01_11_01"))
    })
  })

  describe("isValid", () => {
    it("returns true for valid minos", () => {
      const testCases = [
        fromString("10_11"),
        fromString("100_111_010"),
        fromString("111_101_111"),
      ]
      for (const testCase of testCases) {
        expect(isValid(testCase)).toBeTruthy()
      }
    })

    it("returns true for the monomino", () => {
      expect(isValid(fromString("1"))).toBeTruthy()
    })

    it("returns false for the zero-mino", () => {
      expect(isValid(fromString(""))).toBeFalsy()
    })

    it("returns false for invalid minos", () => {
      const testCases = [
        fromString("101"),
        fromString("10_01"),
        fromString("011_101_110"),
      ]
      for (const testCase of testCases) {
        expect(isValid(testCase)).toBeFalsy()
      }
    })
  })
})
