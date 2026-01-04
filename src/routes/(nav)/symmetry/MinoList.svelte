<script lang="ts">
  import type { Symmetry } from "$lib/mino"
  import { getMinosForSymmetry } from "./helpers"
  import SymmetryMino from "./SymmetryMino.svelte"

  interface Props {
    symmetry: Symmetry
  }

  function getMinoSize(symmetry: Symmetry) {
    switch (symmetry) {
      case "all":
      case "rot2":
      case "diag2":
        return 13
      case "axis2":
      case "rot":
      case "diag":
        return 9
      case "axis":
        return 8
      case "none":
        return 7
    }
  }
  const { symmetry }: Props = $props()
  const minos = $derived(getMinosForSymmetry(symmetry))
  const minoSize = $derived(getMinoSize(symmetry))
</script>

<div class="container">
  {#each minos as genMinos, gen}
    {#if genMinos}
      <div class="gen-wrapper">
        {gen}
        <div class="list-wrapper">
          {#each genMinos as mino}
            <SymmetryMino {mino} size={minoSize} />
          {/each}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.75rem;
  }

  .gen-wrapper {
    display: flex;
    gap: 0.75rem;
  }

  .list-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: space-between;
  }

  /* Left align the last row */
  .list-wrapper::after {
    content: "";
    flex: auto;
  }
</style>
