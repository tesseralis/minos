import fs from "fs"
import Vector from "lib/vector"
import { MinoPattern } from "../internal"

describe("pattern", () => {
  describe("MinoPattern", () => {
    describe(".coords()", () => {
      it("lists all coords of the pattern", () => {
        const pattern = MinoPattern.of([
          { coord: [-1, -1], mino: "11_10" },
          { coord: [-1, 0], mino: "11_10_10" },
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
        const pattern = MinoPattern.of([
          { coord: [1, 1], mino: "100_111" },
          { coord: [0, 0], mino: "1" },
        ])

        const shifted = pattern.shift(new Vector(1, 1))
        expect(shifted.data[0].coord).toEqual(Vector.ZERO)
        expect(shifted.data[1].coord).toEqual(new Vector(-1, -1))
      })
    })

    describe(".transform()", () => {
      it("transforms the positions and transforms of everything in the pattern", () => {
        const pattern = MinoPattern.of([{ coord: [1, 1], mino: "01_01_11" }])
        const expected = MinoPattern.of([{ coord: [1, -4], mino: "100_111" }])

        expect(pattern.transform("rotateLeft").data).toEqual(expected.data)
      })
    })
  })
})
