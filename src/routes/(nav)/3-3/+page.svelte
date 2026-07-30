<script lang="ts">
  import MinoDiv from "$lib/components/MinoDiv.svelte"
  import MinoList from "$lib/components/MinoList"
  import { MONOMINO, Polyomino } from "$lib/mino"

  export function generateGraph(n: number) {
    const nodes: Polyomino[][] = []
    const links: [Polyomino, Polyomino][] = []

    // mapping from each mino to its index in the generation
    const indices = new Map<Polyomino, number>()
    const visited = new Set<Polyomino>([MONOMINO])
    let currentGen = [MONOMINO]

    while (nodes.length < n - 1) {
      const nextGen = []
      for (const mino of currentGen) {
        for (const child of mino.freeChildren()) {
          if (
            !visited.has(child) &&
            child.longestLine().max <= 3 &&
            child.longestWave().max <= 3
          ) {
            nextGen.push(child)
            visited.add(child)
          }
          // if (options.links) {
          //   links.push([mino, child])
          // }
        }
      }

      nodes.push(currentGen)
      currentGen = nextGen
      // currentGen = options.sort?.(nextGen) ?? nextGen
      // if (options.links) {
      //   currentGen.forEach((mino, i) => {
      //     indices.set(mino, i)
      //   })
      // }
    }
    nodes.push(currentGen)

    // if (options.links) {
    //   return { nodes, links, indices }
    // }
    return { nodes }
  }

  let minos = generateGraph(24)
</script>

{#each minos.nodes as gen, n}
  <div style:margin="2rem" style:padding="1rem" style:border="1px solid white">
    <h2>{n + 1}-ominoes {gen.length}</h2>
    {#each gen as mino}
      <span style:padding=".5rem">
        <MinoDiv {mino} size={12} />
      </span>
    {/each}
  </div>
{/each}
