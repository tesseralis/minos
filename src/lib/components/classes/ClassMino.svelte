<script module lang="ts">
  import type { Polyomino } from "$lib/mino"
  import Vector from "$lib/vector"
  import { minBy } from "lodash-es"
  import MinoLink from "$lib/components/MinoLink.svelte"
  import { getDirColor } from "./helpers"
  import { getPoints } from "$lib/components/svgUtils"

  function getPathSegments(mino: Polyomino) {
    const outline = mino.boundary().outlineVec().toArray()
    // get the bottom-right point of the outline
    const bottomRow = outline.filter(
      (point) => point.y === Math.max(...outline.map((p) => p.y)),
    )
    const startPoint = minBy(bottomRow, (p) => p.x)!
    // shift so we start with the bottom right
    const index = outline.findIndex((p) => p.equals(startPoint))
    const cycledOutline = outline.slice(index).concat(outline.slice(0, index))

    // group the segments together
    const groups = []
    let horizDir = "right"
    let vertDir = "up"
    let current = { dir: horizDir[0] + vertDir[0], points: [] as Vector[] }
    for (let i = 0; i < cycledOutline.length; i += 2) {
      const p0 = cycledOutline[i]
      const p1 = cycledOutline[i + 1]
      const p2 = cycledOutline[i + 2] ?? cycledOutline[0] // end case
      const horizVec = p1.sub(p0)
      const vertVec = p2.sub(p1)
      if (
        getDirection(horizVec) !== horizDir ||
        getDirection(vertVec) !== vertDir
      ) {
        current.points.push(p0)
        groups.push(current)
        horizDir = getDirection(horizVec)
        vertDir = getDirection(vertVec)
        current = {
          dir: horizDir[0] + vertDir[0],
          points: [p0, p1],
        }
      } else {
        current.points.push(p0)
        current.points.push(p1)
      }
    }
    current.points.push(cycledOutline[0])
    groups.push(current)
    return groups
  }

  function getDirection(v: Vector) {
    if (v.x === 0 && v.y > 0) {
      return "down"
    } else if (v.x === 0 && v.y < 0) {
      return "up"
    } else if (v.x > 0 && v.y === 0) {
      return "right"
    } else if (v.x < 0 && v.y === 0) {
      return "left"
    } else {
      throw new Error(`Invalid cardinal direction given: ${v.toString()}`)
    }
  }
</script>

<script lang="ts">
  interface Props {
    mino: Polyomino
    size: number
    currentIndex: number
  }

  const { mino, size, currentIndex }: Props = $props()
  const segments = $derived(getPathSegments(mino))
</script>

<div>
  <MinoLink
    href="/catalog/{mino.toString()}"
    {mino}
    {size}
    strokeWidth={4}
    gridStrokeWidth={1}
    gridStyle="thin"
  >
    {#snippet markings({ transform })}
      {#each segments as { dir, points }, index}
        <polyline
          class:selected={currentIndex === index}
          points={getPoints(points.map(transform))}
          stroke="hsl(from {getDirColor(dir)} h s calc(l - 15))"
        />
      {/each}
    {/snippet}
  </MinoLink>
</div>

<style>
  polyline {
    stroke-width: 2;
    stroke-linecap: round;
    fill: none;
  }

  polyline.selected {
    stroke: white;
  }
</style>
