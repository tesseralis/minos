<script lang="ts">
  import { nodes } from "$lib/components/graph"
  import MinoDiv from "$lib/components/MinoDiv.svelte"
  import type { Coord, Polyomino } from "$lib/mino"
  import { neighbors, px, py } from "$lib/mino/data"
  import { countBy, groupBy, indexOf } from "lodash-es"

  function getCoordType(mino: Polyomino, coord: Coord) {
    const nbrs = neighbors(coord)
      .filter((nbr) => mino.hasRaw(nbr))
      .toArray()
    if (nbrs.length === 2) {
      const [a, b] = nbrs
      return px(a) === px(b) || py(a) === py(b) ? "2-trans" : "2-cis"
    } else {
      return nbrs.length
    }
  }

  function coordCounts(mino: Polyomino) {
    return countBy(mino.data, (coord) => getCoordType(mino, coord))
  }

  const minosByCoordCount = nodes.map((gen) => {
    return groupBy(gen, (mino) => {
      const {
        1: a = 0,
        "2-trans": trans2 = 0,
        "2-cis": cis2 = 0,
        3: b = 0,
        4: c = 0,
      } = coordCounts(mino)
      return [a, trans2, cis2, b, c].join(",")
    })
  })
</script>

{#each minosByCoordCount as gen, i}
  <div class="gen">
    <h2>{i + 1}</h2>
    <div class="gen-list">
      {#each Object.entries(gen) as [counts, list]}
        <div class="section">
          <h3>{counts}</h3>
          <div class="list">
            {#each list as mino}
              <MinoDiv {mino} size={10} />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/each}

<style>
  .gen {
    margin: 2rem;
  }
  .gen-list {
    display: flex;
    flex-wrap: wrap;
  }

  .section {
    border: 1px solid white;
    padding: 0.5rem;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
