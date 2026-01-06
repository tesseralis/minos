<script lang="ts">
  import { colors } from "$lib/components/theme"
  import { center, endpoints } from "../svgUtils"
  import { outerRingRadius, halfRadius } from "./helpers.svelte"
  const borderColor = "#aaa"
</script>

<g opacity={2 / 3}>
  <circle r={outerRingRadius} fill={colors.bg} stroke={borderColor} />
  <line
    {...endpoints([-outerRingRadius, 0], [-halfRadius, 0])}
    stroke={borderColor}
    stroke-width={1}
  />
  <line
    {...endpoints([halfRadius, 0], [outerRingRadius, 0])}
    stroke={borderColor}
    stroke-width={1}
  />
  <circle {...center([-halfRadius, 0])} r={3} fill={borderColor} />
  <circle {...center([halfRadius, 0])} r={3} fill={borderColor} />
</g>

<style>
  g :global(circle) {
    pointer-events: initial;
  }
</style>
