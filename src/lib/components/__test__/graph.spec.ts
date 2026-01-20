import { describe, it, expect } from "vitest"
import { generateGraph } from "../graph"

describe("graph", () => {
  it("generates correctly", () => {
    const { nodes } = generateGraph(9)
    expect(nodes.map((n) => n.length)).toEqual([
      1, 1, 2, 5, 12, 35, 108, 369, 1285,
    ])
  })
})
