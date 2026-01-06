<script lang="ts">
  import { innerRingRadius as radius } from "./helpers.svelte"
  import ReflectionAxes from "./ReflectionAxes.svelte"
  import RotationMarkers from "./RotationMarkers.svelte"
  import TransformButtons from "./TransformButtons.svelte"
  import { getSymmetryColor } from "../graph"

  let { mino = $bindable() } = $props()
  const color = $derived(getSymmetryColor(mino.transform.symmetry()))
</script>

<g opacity={2 / 3}>
  <!-- Hide the strands behind the component -->
  <circle class="circle" style:--color={color} r={radius} />
  <ReflectionAxes {mino} />
  <RotationMarkers {mino} />
  <TransformButtons bind:mino visible={true} />
  <circle r={radius} fill="none" stroke={color} stroke-width={3} />
</g>

<style>
  .circle {
    pointer-events: initial;
    fill: color-mix(in srgb, var(--color), var(--color-bg) 90%);
  }
</style>
