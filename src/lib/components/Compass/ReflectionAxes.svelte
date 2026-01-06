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

  import { svgTransform } from "../svgUtils"
  import { endpoints } from "../svgUtils"
  import { colors } from "../theme"
  import {
    getCompassContext,
    innerRingRadius as radius,
  } from "./helpers.svelte"

  const { mino } = $props()
  const color = $derived(getSymmetryColor(mino.transform.symmetry()))
  const context = $derived(getCompassContext())
</script>

<g opacity={2 / 3}>
  {#each reflectionOrder as reflection, i}
    {@const isHovered = reflection === context.transform}
    {#if mino.transform.hasSymmetry(reflection) || isHovered}
      <line
        {...endpoints([-radius, 0], [radius, 0])}
        stroke={isHovered ? colors.highlight : color}
        stroke-width={isHovered ? 4 : 2}
        transform={svgTransform()
          .rotate(45 * i)
          .toString()}
      />
    {/if}
  {/each}
</g>
