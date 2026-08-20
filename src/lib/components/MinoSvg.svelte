<!-- @component
Draws a mino in SVG using the given center x and y coordinates, size, fill, stroke color, etc.

Style props:

* --fill
* --stroke

 -->
<script lang="ts" module>
  export interface Props {
    mino: Polyomino
    coord: Vector
    size: number
    strokeWidth?: number
    gridStrokeWidth?: number
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
  import { Polyomino } from "$lib/mino"
  import { getAnchor } from "./utils"
  import { onHover } from "./svgUtils"
  import { getMinoColor } from "./graph"

  const {
    mino,
    coord,
    size,
    anchor = "center center",
    gridStyle = "thick",
    onclick,
    onhover,
    strokeWidth: _strokeWidth,
    gridStrokeWidth: _gridStrokeWidth,
  }: Props = $props()

  const id = $props.id()

  const strokeWidth = $derived(_strokeWidth ?? size / 8)
  const gridStrokeWidth = $derived(_gridStrokeWidth ?? strokeWidth / 2)

  const scale = (v: Vector) => v.scale(size)
  const scaledOutline = $derived(
    mino.boundary().outlineVec().map(scale).toArray(),
  )
  const anchorPoint = $derived(getAnchor(scaledOutline, anchor))

  const translate = (v: Vector) => v.sub(anchorPoint).add(coord)
  const outlinePoints = $derived(scaledOutline.map(translate))

  const inlinePoints = $derived.by(() => {
    return mino
      .innerBoundaries()
      .map((boundary) => {
        return boundary.outlineVec().map(scale).map(translate).toArray()
      })
      .toArray()
  })

  const outlinePath = $derived.by(() => {
    const path = d3path()
    const [p0, ...ps] = outlinePoints
    path.moveTo(p0.x, p0.y)
    for (const point of ps) {
      path.lineTo(point.x, point.y)
    }
    path.closePath()

    for (const inline of inlinePoints) {
      const [p0, ...ps] = inline
      path.moveTo(p0.x, p0.y)
      for (const point of ps) {
        path.lineTo(point.x, point.y)
      }
      path.closePath()
    }
    return path
  })

  const { stroke, fill } = $derived(getMinoColor(mino))
</script>

<g
  class={["container", onclick && "clickable"]}
  style:--derived-stroke="var(--stroke, {stroke})"
  style:--derived-fill="var(--fill, {fill})"
>
  <g {onclick} {...onHover(onhover)}>
    <defs>
      <pattern id="{id}-mask" width={1 / mino.width} height={1 / mino.height}>
        <rect
          x="0"
          y="0"
          width={size}
          height={size}
          fill="var(--derived-fill)"
          stroke="var(--derived-stroke)"
          stroke-width={gridStrokeWidth}
          stroke-opacity={gridStyle === "thick" ? 1 : 0.25}
        />
      </pattern>
    </defs>
    <path
      class="outline"
      d={outlinePath.toString()}
      stroke-width={strokeWidth}
      fill={gridStyle !== "none" ? `url(#${id}-mask)` : "var(--derived-fill)"}
      fill-rule="evenodd"
    />
  </g>
</g>

<style>
  .outline {
    stroke: var(--derived-stroke);
  }

  .clickable {
    cursor: pointer;
  }
</style>
