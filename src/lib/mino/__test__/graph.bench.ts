import { describe, bench } from "vitest"
import { generateGraph } from "../enumerate"

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
