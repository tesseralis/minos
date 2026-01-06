<script lang="ts">
  import tinycolor from "tinycolor2"
  import { innerRingRadius as radius } from "./helpers.svelte"
  import { colors } from "../theme"
  import ReflectionAxes from "./ReflectionAxes.svelte"
  import RotationMarkers from "./RotationMarkers.svelte"
  import TransformButtons from "./TransformButtons.svelte"
  import { getSymmetryColor } from "../graph"

  let { mino = $bindable() } = $props()
  const color = $derived(getSymmetryColor(mino.transform.symmetry()))
</script>

<g opacity={2 / 3}>
  <!-- Hide the strands behind the component -->
  <circle
    class="circle"
    r={radius}
    fill={tinycolor.mix(color, colors.bg, 90).toString()}
  />
  <ReflectionAxes {mino} />
  <RotationMarkers {mino} />
  <TransformButtons bind:mino visible={true} />
  <circle r={radius} fill="none" stroke={color} stroke-width={3} />
</g>

<style>
  g :global(.circle) {
    pointer-events: initial;
  }
</style>
