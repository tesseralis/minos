<script lang="ts">
  import { NUM_GENERATIONS, getMinoColor, nodes } from "$lib/components/graph"
  import SelectableMino from "$lib/components/SelectableMino.svelte"
  import type { Polyomino } from "$lib/mino"
  import { onMount } from "svelte"
  import { getCoords } from "./treeHelpers"
  import { fade } from "svelte/transition"

  interface Props {
    selected?: Polyomino
  }

  const graphMinos = nodes.map((gen) =>
    gen.map((mino) => mino.transform.apply("flipMainDiag")),
  )

  function getBlockSize(gen: number) {
    return 2 + (NUM_GENERATIONS - gen) ** 2 / 2
  }

  let { selected = $bindable() }: Props = $props()
  let visible = $state(false)

  onMount(() => {
    visible = true
  })
</script>

{#each graphMinos as minos, i}
  {@const gen = i + 1}
  {#if gen <= 6 || visible}
    <g in:fade>
      {#each minos as mino}
        {@const coord = getCoords(mino)}
        {@const { stroke, fill } = getMinoColor(mino)}
        <SelectableMino
          {mino}
          {coord}
          size={getBlockSize(gen)}
          selected={selected?.transform.equivalent(mino)}
          --stroke={stroke}
          --fill={fill}
          onselect={(_selected) => {
            selected = _selected
          }}
        />
      {/each}
    </g>
  {/if}
{/each}
