<script lang="ts">
  import { center, endpoints } from "../svgUtils"
  import { outerRingRadius, halfRadius } from "./helpers.svelte"
</script>

<g>
  <circle class="outer-ring" r={outerRingRadius} />
  <line {...endpoints([-outerRingRadius, 0], [-halfRadius, 0])} />
  <line {...endpoints([halfRadius, 0], [outerRingRadius, 0])} />
  <circle {...center([-halfRadius, 0])} r={3} />
  <circle {...center([halfRadius, 0])} r={3} />
</g>

<style>
  g {
    --border-color: #aaa;
    opacity: 2/3;
  }

  circle {
    pointer-events: initial;
    fill: var(--border-color);
  }

  line {
    stroke: var(--border-color);
    stroke-width: 1;
  }

  .outer-ring {
    fill: var(--color-bg);
    stroke: var(--color-fg);
  }
</style>
