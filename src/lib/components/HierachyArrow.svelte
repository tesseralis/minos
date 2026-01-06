<script lang="ts">
  import { getPoints } from "./svgUtils"

  const {
    direction = "down",
    size,
  }: {
    direction?: string
    size: number
  } = $props()
  const width = 1

  function getAngle(direction: string) {
    switch (direction) {
      case "up right":
        return 45
      case "up left":
        return -45
      case "down":
      default:
        return 0
    }
  }
</script>

<svg viewBox="-2 -2 4 4" width={size}>
  <polygon
    style:--angle="{getAngle(direction)}deg"
    points={getPoints([
      [0, 1],
      [-width, 2],
      [0, -2],
      [width, 2],
    ])}
  />
</svg>

<style>
  polygon {
    fill: none;
    stroke: var(--color-muted);
    stroke-width: 0.2;
    rotate: var(--angle);
  }
</style>
