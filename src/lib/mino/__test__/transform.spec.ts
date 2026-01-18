import { describe, it, expect } from "vitest"
import { Polyomino } from "../internal"

describe("transforms", () => {
  it("generates the right transforms for the L mino", () => {
    // 111
    // 100
    const mino = Polyomino.fromString("111_100")
    const transforms = mino.transform.all()
    expect(transforms.map((t) => t.toString())).toEqual(
      expect.arrayContaining([
        mino.toString(),
        "10_10_11",
        "001_111",
        "11_01_01",
        "100_111",
        "10_10_11",
        "01_01_11",
        "11_10_10",
      ]),
    )
  })

  it("does not repeat transformations", () => {
    // The X pentomino
    const mino = Polyomino.fromString("010_111_010")
    expect(new Set(mino.transform.all()).size).toEqual(1)
  })
})
