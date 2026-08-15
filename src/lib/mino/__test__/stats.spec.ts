// A collection of snapshot tests to verify various facts about polyominoes

import { countBy } from "lodash-es"
import { generateGraph } from "../enumerate"
import { expect, test } from "vitest"

const { nodes: minos } = generateGraph(11)

// https://oeis.org/A000105
test("counts", () => {
  const counts = minos.map((gen) => gen.length)
  expect(counts).toMatchSnapshot()
})

// https://oeis.org/A006749 and others
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

// https://oeis.org/A054359
test("tilings", () => {
  // TODO incorrect for n >= 9
  const tilingCounts = minos
    .slice(0, 8)
    .map((gen) => gen.filter((mino) => !mino.tilings.has()).length)
  expect(tilingCounts).toMatchSnapshot()
})

// https://oeis.org/A001419
test("holes", () => {
  const holeCounts = minos.map(
    (gen) => gen.filter((mino) => mino.hasHole()).length,
  )
  expect(holeCounts).toMatchSnapshot()
})

// https://oeis.org/A359519
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
