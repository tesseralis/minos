import fs from "fs"
import { parsePattern } from "mino"

const files = [
  "5-rect",
  "5-square",
  "6-rect",
  "6-square",
  "7-rect",
  "7-square",
  "8-square",
]

const freeCounts = [0, 1, 1, 2, 5, 12, 35, 108, 369]

// TODO test small minos
function testFile(filename: string) {
  const order = parseInt(filename.split("-")[0])
  const patStr = fs.readFileSync(
    `${process.cwd()}/pages/packing/data/${filename}.txt`,
    "utf-8",
  )
  const pattern = parsePattern(patStr)
  const minos = new Set(pattern.map((p) => p.mino.transform.free()))
  expect(minos.size).toEqual(freeCounts[order])
  expect(pattern.every(({ mino }) => mino.order === order)).toBe(true)
}

describe("packing", () => {
  for (const filename of files) {
    it(`${filename} is valid`, () => {
      testFile(filename)
    })
  }
})
