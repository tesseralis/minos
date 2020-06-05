import { getMino as getMinoData } from "../data"
// import { getTransforms } from "../transform"
import Polyomino from "../Polyomino"

function getMino(data: number, width: number) {
  return Polyomino.fromData(getMinoData(data, width))
}

describe("transforms", () => {
  it("generates the right transforms for the L mino", () => {
    // 111
    // 100
    const mino = getMino(0b111_100, 3)
    const transforms = mino.transforms()
    expect([...transforms]).toEqual(
      expect.arrayContaining([
        mino,
        getMino(0b10_10_11, 2),
        getMino(0b001_111, 3),
        getMino(0b11_01_01, 2),
        getMino(0b100_111, 3),
        getMino(0b11_1001, 3),
        getMino(0b01_01_11, 2),
        getMino(0b11_10_10, 2),
      ]),
    )
  })

  it("does not repeat transformations", () => {
    // The X pentomino
    const mino = getMino(0b010_111_010, 3)
    expect(new Set(mino.transforms()).size).toEqual(1)
  })
})
