import { generateGraph } from "$lib/components/graph"
import { countBy } from "lodash-es"

const { nodes } = generateGraph(12)

console.log("Generated nodes")

const classCounts = nodes.map((gen) =>
  countBy(gen, (mino) => mino.classes.get().name),
)

for (let [i, gen] of nodes.entries()) {
  console.log(`Generation ${i + 1}`)
  const counts = countBy(gen, (mino) => mino.classes.get().name())
  for (const [cls, count] of Object.entries(counts)) {
    console.log(`${cls}: ${count}`)
  }
  console.log()
}
