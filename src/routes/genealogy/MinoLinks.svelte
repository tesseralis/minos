<script lang="ts">
  import { getLinkColor, links } from "$lib/components/graph"
  import { colors } from "$lib/components/theme"
  import { getArc } from "$lib/components/utils"
  import type { Polyomino } from "$lib/mino"
  import Vector from "$lib/vector"
  import { onMount } from "svelte"
  import { getCoords, ringRadius } from "./treeHelpers"
  import { fade } from "svelte/transition"

  /**
   * Return the path for the link that goes from the source to target mino.
   * The link is a circular that intersects both points as well as a third point
   * scaled according to the radius of the generation.
   */
  function getLinkPath([srcMino, tgtMino]: [Polyomino, Polyomino]) {
    const origin = new Vector(0, -1 - ringRadius(srcMino.order) * 0.75)
    return getArc(getCoords(srcMino), getCoords(tgtMino), origin)
  }

  let { selected = $bindable() } = $props()
  let visible = $state(false)

  onMount(() => {
    visible = true
  })
</script>

<g>
  {#each links as link, i}
    {@const [srcMino, tgtMino] = link}
    {@const gen = srcMino.order}
    {@const strokeWidth = 4 / ((gen - 1) / 2 + 1) ** 2}
    {@const isSelected = !!selected && link.includes(selected.transform.free())}
    {#if visible || gen < 5}
      <path
        d={getLinkPath(link)}
        fill="none"
        style:stroke={isSelected
          ? colors.highlight
          : getLinkColor(srcMino, tgtMino)}
        style:stroke-width={strokeWidth * (isSelected ? 3 : 1)}
        in:fade={{ delay: i * 3 }}
      />
    {/if}
  {/each}
</g>

<style>
  path {
    transition: all 250ms ease-in-out;
    pointer-events: none;
  }
</style>
