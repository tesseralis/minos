import { parsePattern } from "../pattern"
// import rect5 from '../../data/5mino-rect.txt'
const rect5 = require("data/5mino-rect.txt")
console.log(rect5)

describe("parsePattern", () => {
  it("returns the correct polyominoes", () => {
    const pattern = parsePattern(rect5)
    // for (const { mino, coord } of pattern) {
    //   console.log("coord:", coord)
    //   console.log(mino.display())
    // }
    expect(pattern).toHaveLength(12)
    expect(pattern.every(({ mino }) => mino.order === 5)).toBe(true)
  })
})
