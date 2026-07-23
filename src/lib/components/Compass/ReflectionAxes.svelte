<script module lang="ts">
  export const reflectionOrder = [
    "flipVert",
    "flipMainDiag",
    "flipHoriz",
    "flipMinorDiag",
  ] as const
</script>

<script lang="ts">
  import { getSymmetryColor } from "../graph"
  import { endpoints } from "../svgUtils"
  import {
    getCompassContext,
    innerRingRadius as radius,
  } from "./helpers.svelte"

  const { mino } = $props()
  const color = $derived(getSymmetryColor(mino.transform.symmetry()))
  const context = $derived(getCompassContext())
</script>

<g>
  {#each reflectionOrder as reflection, i}
    {const hovered = reflection === context.transform}
    {#if mino.transform.hasSymmetry(reflection) || hovered}
      <line
        {...endpoints([-radius, 0], [radius, 0])}
        class:hovered
        style:--angle="{45 * i}deg"
        style:--color={color}
      />
    {/if}
  {/each}
</g>

<style>
  g {
    opacity: 2/3;
  }

  line {
    stroke-width: 2;
    stroke: var(--color);
    rotate: var(--angle);
  }

  line.hovered {
    stroke-width: 4;
    stroke: var(--color-highlight);
  }
</style>
