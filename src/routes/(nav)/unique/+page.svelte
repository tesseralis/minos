<script lang="ts">
  import MinoDiv from "$lib/components/MinoDiv.svelte"
  import { DirClass, Polyomino } from "$lib/mino"
  import { groupBy } from "lodash-es"
  import { getBoundaryFamilies } from "../classes/helpers"

  const nonuniqueSets: Polyomino[][] = []
  for (const dirClass of DirClass.all()) {
    const families = getBoundaryFamilies(dirClass.name())
    for (const family of families) {
      for (const gen of family.minos) {
        if (!gen) continue
        if (gen.length > 1) {
          nonuniqueSets.push(gen)
        }
      }
    }
  }

  const nonuniqueSymmetry: Polyomino[][] = []
  for (const set of nonuniqueSets) {
    const symmetries = groupBy(set, (mino) => mino.transform.symmetry())
    nonuniqueSymmetry.push(
      ...Object.values(symmetries).filter((set) => set.length > 1),
    )
  }

  const nonuniqueBoundingBoxes: Polyomino[][] = []
  for (const set of nonuniqueSymmetry) {
    const boundingBox = groupBy(
      set,
      (mino) =>
        `${Math.max(mino.width, mino.height)},${Math.min(mino.width, mino.height)}`,
    )
    nonuniqueBoundingBoxes.push(
      ...Object.values(boundingBox).filter((set) => set.length > 1),
    )
  }

  const nonuniqueLongest: Polyomino[][] = []
  for (const set of nonuniqueBoundingBoxes) {
    const longest = groupBy(
      set,
      (mino) => `${mino.longestLine().max},${mino.longestWave().max}`,
    )
    nonuniqueLongest.push(
      ...Object.values(longest).filter((set) => set.length > 1),
    )
  }
</script>

<p>
  How many properties are necessary to make a polyomino "unique"? Is there a way
  to define a set of criteria so that only one polyomino fits?
</p>

<p>Criteria selected:</p>
<ul>
  <li>Size</li>
  <li>Boundary word (and by extension, directedness class)</li>
  <li>Symmetry</li>
  <li>Bounding box</li>
  <li>Longest line and wave</li>
</ul>

<p>Potential sorting criteria:</p>
<ul>
  <li>
    Exact Graphs (including bends) (useful, since we're differentiating by size
    anyways)
  </li>
  <li>Oriented bounding box (i.e. in relation to directedness class)</li>
</ul>

<div class="list">
  {#each nonuniqueLongest as set}
    <div class="group">
      {#each set as mino}
        <MinoDiv {mino} size={20} />
      {/each}
    </div>
  {/each}
</div>

<style>
  .group {
    border: 1px solid white;
    padding: 1rem;
  }

  .list {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
