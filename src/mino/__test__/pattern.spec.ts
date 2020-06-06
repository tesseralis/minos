import { parsePattern } from "../pattern"
import fs from "fs"

const files = ["5-rect", "5-square", "6-rect", "6-square", "7-rect"]

const freeCounts = [0, 1, 1, 2, 5, 12, 35, 108, 369]

function testFile(filename: string) {
  const order = parseInt(filename.split("-")[0])
  const patStr = fs.readFileSync(`src/data/${filename}.txt`, "utf-8")
  const pattern = parsePattern(patStr)
  const minos = new Set(pattern.map((p) => p.mino))
  expect(minos.size).toEqual(freeCounts[order])
  expect(pattern.every(({ mino }) => mino.order === order)).toBe(true)
}

describe("parsePattern", () => {
  for (const filename of files) {
    it(`works on ${filename}`, () => {
      testFile(filename)
    })
  }
})
