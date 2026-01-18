import { describe } from "node:test"
import { expect, it } from "vitest"
import { generateGraph } from "../graph"
import { Polyomino } from "$lib/mino"

describe("graph", () => {
  it("generates the right amounts", () => {
    // console.log(
    //   Polyomino.of("1000_1110_0011").transform.free().display() + "\n",
    // )
    // console.log(Polyomino.of("1100_0111_0001").transform.free().display())
    // const mino = Polyomino.of("110_010_011").transform.free()
    // // for (let trans of new Set(mino.children().map((c) => c.transform.free()))) {
    // for (let trans of new Set(mino.freeChildren())) {
    //   console.log(trans.display() + "\n")
    //   console.log(trans.key)
    //   console.log(trans.transform.free().display() + "\n")
    //   console.log(trans.transform.free().key)
    //   console.log("-------------")
    // }
    const { nodes } = generateGraph(8)
    // const visited = new Set()
    // if (visited.has(mino.transform.free().toString())) {
    //   console.log("repeat:\n" + mino.display())
    // }
    // visited.add(mino.transform.free().toString())
    // // console.log(mino.display(), "\n")
    // if (!mino.equals(mino.transform.free())) {
    //   console.log(mino.display() + "\n" + mino.transform.free().display())
    // }
    expect(nodes.map((gen) => gen.length)).toEqual([
      1, 1, 2, 5, 12, 35, 108, 369,
    ])
  })
})
