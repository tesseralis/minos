<script lang="ts">
  import { getMinoColor } from "$lib/components/graph"
  import MinoLink from "$lib/components/MinoLink.svelte"
  import SymmetryMarkers from "$lib/components/SymmetryMarkers.svelte"
  import type { Polyomino } from "$lib/mino"

  interface Props {
    mino: Polyomino
    size: number
  }

  const { mino, size }: Props = $props()
  const { stroke, fill } = $derived(getMinoColor(mino))
</script>

<div class="wrapper">
  <MinoLink
    href="/catalog/{mino.toString()}"
    {mino}
    {size}
    {fill}
    {stroke}
    gridStyle="thin"
  >
    <SymmetryMarkers {mino} {size} stroke-width={2} stroke="#ffffffaa" />
  </MinoLink>
</div>

<style>
  .wrapper :global(svg) {
    overflow: visible;
  }
</style>
