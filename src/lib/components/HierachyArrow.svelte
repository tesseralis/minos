<script lang="ts">
  import { Polygon, svgTransform } from "./svg"
  import { colors } from "./theme"

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
  <Polygon
    transform={svgTransform().rotate(getAngle(direction))}
    fill="none"
    stroke={colors.muted}
    stroke-width="0.2"
    points={[
      [0, 1],
      [-width, 2],
      [0, -2],
      [width, 2],
    ]}
  />
</svg>
