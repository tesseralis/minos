import { MONOMINO } from '../mino'
import { generate, generateGraph } from '../generate'
import { getFree } from '../transform'

const fixedCounts = [0, 1, 2, 6, 19, 63, 216, 760, 2725]
const freeCounts = [0, 1, 1, 2, 5, 12, 35, 108, 369]

describe('generate', () => {
  it('generates a set containing the single monomino when n=1', () => {
    const minos = generate(1)
    expect([...minos]).toContain(MONOMINO)
  })

  fixedCounts.forEach((count, n) => {
    it(`correctly calculates the number of fixed minos for n=${n}`, () => {
      const minos = generate(n)
      expect(minos.size).toEqual(count)
    })
  })

  freeCounts.forEach((count, n) => {
    it(`correctly calculates the number of free minos for n=${n}`, () => {
      const minos = getFree(generate(n))
      expect(minos.size).toEqual(count)
    })
  })
})

describe('generateGraph', () => {
  it('correctly generates the free minos', () => {
    const { nodes } = generateGraph(8)
    const sizes = [0, ...nodes.map(gen => gen.length)]
    expect(sizes).toEqual(freeCounts)
  })
})
