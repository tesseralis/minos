import { getOutline } from '../draw'
describe('draw', () => {
  it('works on L tetromino', () => {
    const mino = [[0, 0], [1, 0], [0, 1], [0, 2]]
    const expected = [[0, 0], [0, 3], [1, 3], [1, 1], [2, 1], [2, 0]]
    expect(getOutline(mino)).toEqual(expected)
  })

  it('works with concave minos', () => {
    const mino = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]]
    const expected = [
      [0, 0],
      [0, 2],
      [1, 2],
      [1, 1],
      [2, 1],
      [2, 2],
      [3, 2],
      [3, 0],
    ]
    expect(getOutline(mino)).toEqual(expected)
  })

  it('works with minos with holes', () => {
    const mino = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2]]
    const expected = [
      [0, 0],
      [0, 3],
      [2, 3],
      [2, 2],
      [1, 2],
      [1, 1],
      [2, 1],
      [2, 2],
      [3, 2],
      [3, 0],
    ]
    expect(getOutline(mino)).toEqual(expected)
  })
})
