<script lang="ts">
  import type { Polyomino } from "$lib/mino"
  import type Vector from "$lib/vector"
  import tinycolor from "tinycolor2"
  import { getMinoColor } from "./graph"
  import MinoSvg from "./MinoSvg.svelte"
  import { goto } from "$app/navigation"

  interface Props {
    blockSize: number
    mino: Polyomino
    coord: Vector
  }

  const { blockSize, mino, coord }: Props = $props()

  let hovered = $state(false)
  const { fill } = $derived(getMinoColor(mino))
  const baseFill = $derived(tinycolor(fill))
</script>

<MinoSvg
  {mino}
  coord={coord.scale(blockSize)}
  anchor="top left"
  size={blockSize}
  fill={hovered ? baseFill.clone().lighten().toString() : baseFill.toString()}
  stroke="black"
  gridStyle="thin"
  onhover={(_hovered) => {
    hovered = _hovered
  }}
  onclick={() => {
    goto(`/catalog/${mino.transform.free().toString()}`)
  }}
/>
