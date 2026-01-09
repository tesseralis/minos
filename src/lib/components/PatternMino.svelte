<script lang="ts">
  import type { Polyomino } from "$lib/mino"
  import type Vector from "$lib/vector"
  import { getMinoColor } from "./graph"
  import MinoSvg from "./MinoSvg.svelte"
  import { goto } from "$app/navigation"

  interface Props {
    blockSize: number
    mino: Polyomino
    coord: Vector
  }

  const { blockSize, mino, coord }: Props = $props()
  const { fill } = $derived(getMinoColor(mino))
</script>

<g style:--base-fill={fill}>
  <MinoSvg
    {mino}
    coord={coord.scale(blockSize)}
    anchor="top left"
    size={blockSize}
    --stroke="black"
    gridStyle="thin"
    onclick={() => {
      goto(`/catalog/${mino.transform.free().toString()}`)
    }}
  />
</g>

<style>
  g {
    --fill: var(--base-fill);
  }

  g:hover {
    --fill: hsl(from var(--base-fill) h s calc(l + 15));
  }
</style>
