import { describe, bench } from "vitest"
import { generateGraph } from "../graph"

describe("graph", () => {
  bench(
    "graph generation",
    () => {
      generateGraph(8)
    },
    {
      time: 1000,
    },
  )
})
