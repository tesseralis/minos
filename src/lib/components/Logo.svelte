<script lang="ts">
  import { endpoints, point } from "./svgUtils"

  const size = 10
  const margin = 1
</script>

<svg
  viewBox="{-margin} {-margin} {size * 3 + 2 * margin} {size * 3 + 2 * margin}"
>
  <rect width={size * 3} height={size * 3} />
  <rect {...point([size, size])} width={size} height={size} />
  <line {...endpoints([size, 0], [size, size])} />
  <line {...endpoints([0, 2 * size], [3 * size, 2 * size])} />
</svg>

<style>
  svg {
    aspect-ratio: 1 / 1;
    overflow: visible;
  }

  rect,
  line {
    fill: none;
    stroke: currentcolor;
  }
</style>
