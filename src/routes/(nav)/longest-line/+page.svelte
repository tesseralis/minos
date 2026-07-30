<script lang="ts">
  import { nodes } from "$lib/components/graph"
  import MinoDiv from "$lib/components/MinoDiv.svelte"
  import { Polyomino } from "$lib/mino"

  function linesWavesTable(minos: Polyomino[]) {
    const table: Record<number, Record<number, Polyomino[]>> = []

    for (const mino of minos) {
      const line = mino.longestLine()
      const wave = mino.longestWave()

      if (!table[line.max]) {
        table[line.max] = {}
      }
      if (!table[line.max][wave.max]) {
        table[line.max][wave.max] = []
      }
      table[line.max][wave.max].push(mino)
    }
    return table
  }
</script>

{#each nodes as gen}
  <div class="gen">
    {@render linesWaves(gen)}
  </div>
{/each}

{#snippet linesWaves(minos: Polyomino[])}
  {@const table = linesWavesTable(minos)}
  <div
    class="table"
    style:grid-template-columns="repeat(1fr, {Object.keys(table).length})"
  >
    {#each Object.entries(table) as [l, row]}
      {#each Object.entries(row) as [w, minos]}
        <div class="cell" style:grid-row={l} style:grid-column={w}>
          {#each minos as mino}
            <MinoDiv {mino} size={8} />
          {/each}
        </div>
      {/each}
    {/each}
  </div>
{/snippet}

<style>
  .table {
    display: grid;
  }

  .gen {
    margin: 2rem;
  }
  .cell {
    border: 1px solid white;
  }
</style>
