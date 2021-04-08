import { Polyomino } from ".."

describe("transforms", () => {
  it("generates the right transforms for the L mino", () => {
    // 111
    // 100
    const mino = Polyomino.fromString("111_100")
    const transforms = mino.transform.all()
    expect(transforms).toEqual(
      expect.arrayContaining([
        mino,
        Polyomino.fromString("10_10_11"),
        Polyomino.fromString("001_111"),
        Polyomino.fromString("11_01_01"),
        Polyomino.fromString("100_111"),
        Polyomino.fromString("10_10_11"),
        Polyomino.fromString("01_01_11"),
        Polyomino.fromString("11_10_10"),
      ]),
    )
  })

  it("does not repeat transformations", () => {
    // The X pentomino
    const mino = Polyomino.fromString("010_111_010")
    expect(new Set(mino.transform.all()).size).toEqual(1)
  })
})
