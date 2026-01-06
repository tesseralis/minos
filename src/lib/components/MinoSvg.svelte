<!-- @component
Draws a mino in SVG using the given center x and y coordinates, size, fill, stroke color, etc.

Params:
- _anchor_ a string representing where the edge of the mino should be anchored (e.getComputedStyle. "top left")
 -->
<script lang="ts" module>
  export interface Props {
    mino: Polyomino
    coord: Vector
    size: number
    strokeWidth?: number
    gridStrokeWidth?: number
    fill: string
    stroke: string
    anchor?: string
    // (misnamed) whether the grid lines should be shown, clear, or not
    gridStyle?: "thick" | "thin" | "none"
    onclick?(): void
    onhover?(hovered: boolean): void
  }
</script>

<script lang="ts">
  import { path as d3path } from "d3-path"

  import Vector from "$lib/vector"
  import { Polyomino, O_OCTOMINO } from "$lib/mino"
  import { colors } from "./theme"
  import { getAnchor } from "./utils"
  import { getPoints, onHover, point } from "./svgUtils"

  const {
    mino,
    coord,
    size,
    fill,
    stroke,
    anchor = "center center",
    gridStyle = "thick",
    onclick,
    onhover,
    strokeWidth: _strokeWidth,
    gridStrokeWidth: _gridStrokeWidth,
  }: Props = $props()

  const strokeWidth = $derived(_strokeWidth ?? size / 8)
  const gridStrokeWidth = $derived(_gridStrokeWidth ?? strokeWidth / 2)

  const outline = $derived(mino.boundary().outline())
  const scale = (v: Vector) => v.scale(size)
  const scaledOutline = $derived(outline.map(scale))
  const anchorPoint = $derived(getAnchor(scaledOutline, anchor))

  const translate = (v: Vector) => v.sub(anchorPoint).add(coord)
  const outlinePoints = $derived(scaledOutline.map(translate))

  const minoPoints = $derived(mino.coords())
  const points = $derived(minoPoints.map(scale).map(translate))
  const path = $derived.by(() => {
    const path = d3path()
    for (const point of points) {
      path.moveTo(point.x, point.y + size)
      path.lineTo(point.x, point.y)
      path.lineTo(point.x + size, point.y)
    }
    return path
  })
</script>

<g class={["container", onclick && "clickable"]}>
  <g {onclick} {...onHover(onhover)}>
    <polygon
      points={getPoints(outlinePoints)}
      {fill}
      {stroke}
      stroke-width={strokeWidth}
    />
    {#if mino.equals(O_OCTOMINO)}
      <rect
        fill={colors.bg}
        {...point(translate(scale(new Vector(1, 1))))}
        width={size}
        height={size}
        {stroke}
        stroke-width={strokeWidth}
      />
    {/if}
    {#if gridStyle !== "none"}
      <path
        d={path.toString()}
        {stroke}
        fill="none"
        opacity={gridStyle === "thick" ? 1 : 0.25}
        stroke-width={gridStrokeWidth}
      />
    {/if}
  </g>
</g>

<style>
  .clickable {
    cursor: pointer;
  }
</style>
