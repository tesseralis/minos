import { generateGraph } from "../graph"

const freeCounts = [0, 1, 1, 2, 5, 12, 35, 108, 369]

describe("generateGraph", () => {
  let graph: ReturnType<typeof generateGraph>

  beforeAll(() => {
    graph = generateGraph(8)
  })

  it("correctly generates the free minos", () => {
    const { nodes } = graph
    const sizes = [0, ...nodes.map((gen) => gen.length)]
    expect(sizes).toEqual(freeCounts)
  })

  it("does not generate children for the last generation", () => {
    const { nodes, meta } = graph
    const lastGen = nodes[nodes.length - 1]
    for (let mino of lastGen) {
      expect([...meta[mino].children]).toHaveLength(0)
    }
  })
})
