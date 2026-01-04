<script lang="ts">
  import { Line, Rect } from "./svg"
  const size = 10
  const margin = 1
</script>

<svg
  viewBox="{-margin} {-margin} {size * 3 + 2 * margin} {size * 3 + 2 * margin}"
>
  <Rect width={size * 3} height={size * 3} />
  <Rect coord={[size, size]} width={size} height={size} />
  <Line p1={[size, 0]} p2={[size, size]} />
  <Line p1={[0, 2 * size]} p2={[3 * size, 2 * size]} />
</svg>

<style>
  svg {
    aspect-ratio: 1 / 1;
    overflow: visible;

    :global(rect),
    :global(line) {
      fill: none;
      stroke: currentcolor;
    }
  }
</style>
