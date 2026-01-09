<script lang="ts">
  import { innerRingRadius as radius } from "./helpers.svelte"
  import ReflectionAxes from "./ReflectionAxes.svelte"
  import RotationMarkers from "./RotationMarkers.svelte"
  import TransformButtons from "./TransformButtons.svelte"
  import { getSymmetryColor } from "../graph"

  let { mino = $bindable() } = $props()
  const color = $derived(getSymmetryColor(mino.transform.symmetry()))
</script>

<g style:--color={color}>
  <!-- Hide the strands behind the component -->
  <circle class="background" r={radius} />
  <ReflectionAxes {mino} />
  <RotationMarkers {mino} />
  <TransformButtons bind:mino visible={true} />
  <circle class="border" r={radius} />
</g>

<style>
  g {
    opacity: 2 / 3;
  }
  .background {
    pointer-events: initial;
    fill: color-mix(in srgb, var(--color), var(--color-bg) 90%);
  }
  .border {
    fill: none;
    stroke: var(--color);
    stroke-width: 3;
  }
</style>
