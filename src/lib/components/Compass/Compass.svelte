<script lang="ts">
  import G from "../svg/G.svelte"
  import AlterableMino from "./AlterableMino.svelte"
  import CompassBackground from "./CompassBackground.svelte"
  import CompassLinks from "./CompassLinks.svelte"
  import { CompassContext, setCompassContext, svgSize } from "./helpers.svelte"
  import SymmetryRing from "./SymmetryRing.svelte"

  let { selected = $bindable() } = $props()
  let showEditable = $state(false)

  let context = new CompassContext()
  setCompassContext(context)
</script>

<svg viewBox="{-svgSize} {-svgSize} {svgSize * 2} {svgSize * 2}">
  <G>
    <CompassBackground />
    <CompassLinks bind:mino={selected} />
    <G
      onhover={(hovered) => {
        showEditable = hovered
      }}
    >
      <SymmetryRing bind:mino={selected} />
      <AlterableMino highlight={showEditable} bind:mino={selected} />
    </G>
  </G>
</svg>

<style>
  svg {
    width: 22rem;
    height: 22rem;
    pointer-events: none;
  }
</style>
