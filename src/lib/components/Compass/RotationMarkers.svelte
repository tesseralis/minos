<script lang="ts">
  import type { Point } from "$lib/vector"
  import { range } from "lodash-es"
  import {
    innerRingRadius as radius,
    getCompassContext,
  } from "./helpers.svelte"
  import { svgTransform } from "../svgUtils"
  import { colors } from "../theme"
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
    {@const isHover =
      !!context.transform && (index - hoverIndex + 4) % (4 / order) === 0}
    {#if shouldShow || isHover}
      {@const chiral = mino?.transform.isOneSided()}
      {@const points: Point[] = [[0, size], [size, 0], chiral ? [0, 0] : [-size, 0]]}
      <polygon
        stroke-width={2}
        points={getPoints(points)}
        fill={isHover ? colors.highlight : color}
        transform={svgTransform()
          .translate(0, -radius)
          .rotate(90 * index)
          .toString()}
      />
    {/if}
  {/each}
</g>
