<script lang="ts">
  import type { DirClass } from "$lib/mino"
  import BoundaryFamily from "./BoundaryFamily.svelte"
  import { getBoundaryFamilies } from "./helpers"

  interface Props {
    dirClass: DirClass
  }

  const { dirClass }: Props = $props()
  const families = $derived(getBoundaryFamilies(dirClass.name()))
</script>

<div class="class-list">
  {#each families as { family, minos }}
    <BoundaryFamily {family} {minos} />
  {/each}
</div>

<style>
  .class-list {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
