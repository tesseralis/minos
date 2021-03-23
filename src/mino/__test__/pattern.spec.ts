import { parsePattern, MinoPattern } from "../pattern"
import fs from "fs"
import Vector from "vector"
import Polyomino from "mino/Polyomino"

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
  const patStr = fs.readFileSync(`src/data/${filename}.txt`, "utf-8")
  const pattern = parsePattern(patStr)
  const minos = new Set(pattern.map((p) => p.mino.free()))
  expect(minos.size).toEqual(freeCounts[order])
  expect(pattern.every(({ mino }) => mino.order === order)).toBe(true)
}

describe("pattern", () => {
  describe("parsePattern", () => {
    for (const filename of files) {
      it(`works on ${filename}`, () => {
        testFile(filename)
      })
    }
  })

  describe("MinoPattern", () => {
    describe(".coords()", () => {
      it("lists all coords of the pattern", () => {
        const pattern = new MinoPattern([
          { coord: new Vector(-1, -1), mino: Polyomino.fromString("11_10") },
          { coord: new Vector(-1, 0), mino: Polyomino.fromString("11_10_10") },
        ])
        const coords = [...pattern.coords()]
        const expected: [number, number][] = [
          [0, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
          [-1, 1],
          [0, 1],
          [1, 1],
        ]
        expect(coords).toEqual(
          expect.arrayContaining(expected.map(Vector.fromArray)),
        )
      })
    })

    describe(".shift()", () => {
      it("translates the contents of the pattern correctly", () => {
        const pattern = new MinoPattern([
          { coord: new Vector(1, 1), mino: Polyomino.fromString("100_111") },
          { coord: new Vector(0, 0), mino: Polyomino.fromString("1") },
        ])

        const shifted = pattern.shift(new Vector(1, 1))
        expect(shifted.data[0].coord).toEqual(Vector.ZERO)
        expect(shifted.data[1].coord).toEqual(new Vector(-1, -1))
      })
    })

    describe(".transform()", () => {
      it("transforms the positions and transforms of everything in the pattern", () => {
        const pattern = new MinoPattern([
          { coord: new Vector(1, 1), mino: Polyomino.fromString("01_01_11") },
        ])
        const expected = new MinoPattern([
          { coord: new Vector(1, -4), mino: Polyomino.fromString("100_111") },
        ])

        expect(pattern.transform("rotateLeft").data).toEqual(expected.data)
      })
    })
  })
})
