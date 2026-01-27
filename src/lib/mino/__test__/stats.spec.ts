// A collection of snapshot tests to verify various facts about polyominoes

import { countBy } from "lodash-es"
import { generateGraph } from "../enumerate"
import { expect, test } from "vitest"

const { nodes: minos } = generateGraph(10)

test("counts", () => {
  const counts = minos.map((gen) => gen.length)
  expect(counts).toMatchSnapshot()
})

test("symmetries", () => {
  const symCounts = minos.map((gen) =>
    countBy(gen, (mino) => mino.transform.symmetry()),
  )
  expect(symCounts).toMatchSnapshot()
})

test("classes", () => {
  const clsCounts = minos.map((gen) =>
    countBy(gen, (mino) => mino.classes.get().name()),
  )
  expect(clsCounts).toMatchSnapshot()
})

test("tilings", () => {
  // TODO incorrect for n >= 9
  const tilingCounts = minos
    .slice(0, 8)
    .map((gen) => gen.filter((mino) => !mino.tilings.has()).length)
  expect(tilingCounts).toMatchSnapshot()
})

test("holes", () => {
  // TODO incorrect for n >= 9
  const holeCounts = minos
    .slice(0, 8)
    .map((gen) => gen.filter((mino) => mino.classes.hasHole()).length)
  expect(holeCounts).toMatchSnapshot()
})
