import { getMino } from '../mino'
import { getTransforms } from '../transform'

describe('transforms', () => {
  it('generates the right transforms for the L mino', () => {
    // 111
    // 100
    const mino = getMino(0b111100, 3)
    const transforms = getTransforms(mino)
    expect([...transforms]).toEqual(
      expect.arrayContaining([
        mino,
        getMino(0b101011, 2),
        getMino(0b001111, 3),
        getMino(0b110101, 2),
        getMino(0b100111, 3),
        getMino(0b111001, 3),
        getMino(0b010111, 2),
        getMino(0b111010, 2),
      ]),
    )
  })

  it('does not repeat transformations', () => {
    // 010
    // 111
    // 010
    const mino = getMino(0b010111010, 3)
    expect([...getTransforms(mino)]).toHaveLength(1)
  })
})
