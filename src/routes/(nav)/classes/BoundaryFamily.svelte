<script lang="ts">
  import type { Polyomino } from "$lib/mino"
  import BoundaryWord from "$lib/components/classes/BoundaryWord.svelte"
  import ClassMino from "$lib/components/classes/ClassMino.svelte"

  interface Props {
    family: string
    minos: Polyomino[][]
  }

  const { family, minos }: Props = $props()
  let currentIndex = $state(-1)
</script>

<div class="boundary-family">
  <BoundaryWord word={family} bind:currentIndex />
  <div class="mino-list">
    {#each minos as gen, index}
      {#if gen}
        <div class="gen">
          <div>{index}</div>
          <div class="gen-list">
            {#each gen as mino}
              <ClassMino {mino} size={10} {currentIndex} />
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .boundary-family {
    border: 1px dimgray solid;
    padding: 1rem;
    padding-right: 1.5rem;
    border-radius: 1rem;
    flex-grow: 1;
  }

  .mino-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem 1.5rem;
  }

  .gen {
    flex-grow: 1;
    display: flex;
    gap: 0.75rem;
  }

  .gen-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;

    justify-content: space-between;
  }

  .gen-list::after {
    content: "";
    flex: auto;
  }
</style>
