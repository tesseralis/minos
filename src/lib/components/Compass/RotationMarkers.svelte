<script lang="ts">
  import type { Point } from "$lib/vector"
  import { range } from "lodash-es"
  import {
    innerRingRadius as radius,
    getCompassContext,
  } from "./helpers.svelte"
  import { getSymmetryColor } from "../graph"
  import { getPoints } from "../svgUtils"

  const { mino } = $props()
  const color = $derived(getSymmetryColor(mino.transform.symmetry()))

  const size = 10
  const rotationList = [
    "identity",
    "rotateRight",
    "rotateHalf",
    "rotateLeft",
  ] as const

  const rotationHover = new Map<string, number>(
    rotationList.map((t, i) => [t, i]),
  )
  const context = $derived(getCompassContext())
  const order = $derived(
    rotationList.filter((t) => mino?.transform.hasSymmetry(t)).length,
  )
  const hoverIndex = $derived(
    context.transform ? rotationHover.get(context.transform!)! : 0,
  )
</script>

<g>
  {#each range(4) as index}
    {@const shouldShow = index % (4 / order) === 0}
    {@const hovered =
      !!context.transform && (index - hoverIndex + 4) % (4 / order) === 0}
    {#if shouldShow || hovered}
      {@const chiral = mino?.transform.isOneSided()}
      {@const points: Point[] = [[0, size], [size, 0], chiral ? [0, 0] : [-size, 0]]}
      <polygon
        points={getPoints(points)}
        class:hovered
        style:--color={color}
        style:--translateY="{-radius}px"
        style:--angle="{90 * index}deg"
      />
    {/if}
  {/each}
</g>

<style>
  polygon {
    stroke-width: 2;
    fill: var(--color);
    transform: rotate(var(--angle)) translate(0, var(--translateY));
  }

  polygon.hovered {
    fill: var(--color-highlight);
  }
</style>
