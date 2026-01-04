<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import MinoDiv from "$lib/components/MinoDiv.svelte"
  import Tiling from "$lib/components/Tiling.svelte"

  const { data } = $props()
  const { mino } = $derived(data)
  const gridSize = $derived(Math.round(Math.sqrt(64 * mino.order) / 2) * 2)
</script>

{#snippet minoDiv()}
  <MinoDiv
    {mino}
    size={Math.min(30 / mino.height, 15)}
    fill="none"
    stroke="currentcolor"
  />
{/snippet}

<div class="page">
  <Breadcrumbs
    paths={[
      ["Tiling", "/tiling"],
      [minoDiv, `/tiling/${mino.toString()}`],
    ]}
  />
  <div class="tiling">
    <Tiling {mino} {gridSize} />
  </div>
  <a href="/catalog/{mino.toString()}">Go to catalog entry</a>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
  }

  .tiling {
    width: 100%;
    max-width: 90vmin;
    margin-bottom: 1rem;
  }
</style>
