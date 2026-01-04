<script lang="ts">
  import { Polyomino } from "$lib/mino"
  import { nodes } from "../graph"
  import GenerationList from "./GenerationList.svelte"
  import MinoFilter, { applyFilter, type FilterOptions } from "./MinoFilter"

  interface Props {
    selected: Polyomino | undefined
    href(mino: Polyomino): string
    filter?: FilterOptions
  }

  const listMinos = nodes.map(Polyomino.sort)

  let {
    selected,
    href,
    filter = $bindable({ symmetries: [], classes: [], yesNo: {} }),
  }: Props = $props()
  const minoSets = $derived(applyFilter(listMinos, filter))
</script>

<div>
  <MinoFilter bind:value={filter} />
  <div class="list">
    {#if minoSets.every((set) => set.length === 0)}
      <p>No polyominoes match the given criteria.</p>
    {:else}
      {#each minoSets as minos, i}
        {@const gen = i + 1}
        {@const hasSelected = !!selected && selected.order === gen}
        <GenerationList
          {minos}
          {gen}
          selected={hasSelected ? selected : null}
          {href}
        />
      {/each}
    {/if}
  </div>
</div>

<style>
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 2rem;
  }

  p {
    font-size: 1.25rem;
  }
</style>
