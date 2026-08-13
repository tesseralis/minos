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

test("punctures", () => {
  const holeCounts = minos.map(
    (gen) => gen.filter((mino) => mino.hasPuncture()).length,
  )
  expect(holeCounts).toMatchSnapshot()
})

test("longestLine", () => {
  const longestLines = minos.map((gen) =>
    countBy(gen, (mino) => mino.longestLine().max),
  )
  expect(longestLines).toMatchSnapshot()
})

test("longestWave", () => {
  const longestWaves = minos.map((gen) =>
    countBy(gen, (mino) => mino.longestWave().max),
  )
  expect(longestWaves).toMatchSnapshot()
})
