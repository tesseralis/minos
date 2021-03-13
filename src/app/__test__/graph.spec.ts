import { generateGraph } from "../graph"
import { getTiling } from "mino/tiling"

const freeCounts = [1, 1, 2, 5, 12, 35, 108, 369]
const nontilerCounts = [0, 0, 0, 0, 0, 0, 4, 26]

// FIXME rename this file
describe("app mino logic", () => {
  let graph: ReturnType<typeof generateGraph>
  beforeAll(() => {
    graph = generateGraph(8)
  })

  describe("generateGraph", () => {
    it("correctly generates the free minos", () => {
      const { nodes } = graph
      const sizes = nodes.map((gen) => gen.length)
      expect(sizes).toEqual(freeCounts)
    })
  })

  describe("getTiling", () => {
    it("returns the correct number of tiling minos", () => {
      const { nodes } = graph
      const nontilers = nodes.map((gen) =>
        gen.filter((mino) => !getTiling(mino)),
      )
      const actualCounts = nontilers.map((gen) => gen.length)
      expect(actualCounts).toEqual(nontilerCounts)
    })
  })
})
