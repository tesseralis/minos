<script lang="ts">
  import { colors } from "$lib/components/theme"
  import { Circle, Line } from "$lib/components/svg"
  import { outerRingRadius, halfRadius } from "./helpers.svelte"
  const borderColor = "#aaa"
</script>

<g opacity={2 / 3}>
  <Circle r={outerRingRadius} fill={colors.bg} stroke={borderColor} />
  <Line
    p1={[-outerRingRadius, 0]}
    p2={[-halfRadius, 0]}
    stroke={borderColor}
    stroke-width={1}
  />
  <Line
    p1={[halfRadius, 0]}
    p2={[outerRingRadius, 0]}
    stroke={borderColor}
    stroke-width={1}
  />
  <Circle center={[-halfRadius, 0]} r={3} fill={borderColor} />
  <Circle center={[halfRadius, 0]} r={3} fill={borderColor} />
</g>

<style>
  g :global(circle) {
    pointer-events: initial;
  }
</style>
