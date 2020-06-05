import { fromString, isValid, MONOMINO } from "../data"

describe("isValid", () => {
  it("returns true for valid minos", () => {
    const testCases = [
      fromString("11_01"),
      fromString("010_111_001"),
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
    expect(isValid(0)).toBeFalsy()
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
