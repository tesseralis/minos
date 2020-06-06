import { parsePattern } from "../pattern"
import fs from "fs"

describe("parsePattern", () => {
  it("returns the correct polyominoes", () => {
    const patStr = fs.readFileSync("src/data/5mino-rect.txt", "utf-8")
    const pattern = parsePattern(patStr)
    expect(pattern).toHaveLength(12)
    expect(pattern.every(({ mino }) => mino.order === 5)).toBe(true)
  })

  it("works with holes", () => {
    const patStr = fs.readFileSync("src/data/5mino-square.txt", "utf-8")
    const pattern = parsePattern(patStr)
    expect(pattern).toHaveLength(12)
    expect(pattern.every(({ mino }) => mino.order === 5)).toBe(true)
  })

  it("works with big files", () => {
    const patStr = fs.readFileSync("src/data/7mino-rect.txt", "utf-8")
    const pattern = parsePattern(patStr)
    expect(pattern).toHaveLength(108)
    expect(pattern.every(({ mino }) => mino.order === 7)).toBe(true)
  })
})
