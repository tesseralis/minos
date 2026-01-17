import { once } from "lodash-es"
import { describe, bench } from "vitest"
import { generateGraph } from "../graph"
import { Polyomino } from "$lib/mino"

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
