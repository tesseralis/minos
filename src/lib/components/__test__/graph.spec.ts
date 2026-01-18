import { describe } from "node:test"
import { expect, it } from "vitest"
import { generateGraph } from "../graph"
import { Polyomino } from "$lib/mino"

describe("graph", () => {
  it("generates the right amounts", () => {
    const { nodes } = generateGraph(8)
    expect(nodes.map((gen) => gen.length)).toEqual([
      1, 1, 2, 5, 12, 35, 108, 369,
    ])
  })
})
