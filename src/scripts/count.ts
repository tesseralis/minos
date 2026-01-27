import { generateGraph } from "$lib/mino/enumerate"
import { countBy } from "lodash-es"

// Currently 13 is the highest we can go
const { nodes } = generateGraph(13)

console.log("Generated nodes")

for (let [i, gen] of nodes.entries()) {
  console.log(`Generation ${i + 1}`)
  const counts = countBy(gen, (mino) => mino.classes.get().name())
  for (const [cls, count] of Object.entries(counts)) {
    console.log(`${cls}: ${count}`)
  }
  console.log()
}
