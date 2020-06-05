import { fromBits, isValid, MONOMINO } from "../data"

describe("isValid", () => {
  it("returns true for valid minos", () => {
    const testCases = [
      fromBits(0b11_01, 2),
      fromBits(0b010_111_001, 3),
      fromBits(0b111_101_111, 3),
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
      fromBits(0b101, 3),
      fromBits(0b10_01, 2),
      fromBits(0b011_101_110, 3),
    ]
    for (const testCase of testCases) {
      expect(isValid(testCase)).toBeFalsy()
    }
  })
})
