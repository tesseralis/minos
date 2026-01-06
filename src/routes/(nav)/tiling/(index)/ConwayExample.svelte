<script lang="ts">
  import { center, getPoints } from "$lib/components/svgUtils"
  import { colors } from "$lib/components/theme"
  import Wrapper from "./Wrapper.svelte"

  const cellSize = 30
  const lines = [
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    [
      [0, 1],
      [0, 4],
    ],
    [
      [0, 4],
      [1, 4],
    ],
    [
      [1, 4],
      [2, 4],
      [2, 3],
    ],
    [
      [2, 3],
      [1, 3],
      [1, 2],
      [4, 2],
      [4, 1],
      [3, 1],
    ],
    [
      [3, 1],
      [2, 1],
      [2, 0],
      [1, 0],
    ],
  ]
  const circles = [
    [0, 2.5],
    [0.5, 4],
    [2.5, 2],
    [2, 0.5],
  ]
</script>

<Wrapper>
  <svg width={cellSize * 4} height={cellSize * 4}>
    {#each lines as points, i}
      <polyline
        stroke={i % 3 === 0 ? "grey" : colors.palette[i > 3 ? i - 2 : i - 1]}
        points={getPoints(
          points.map((p) => [p[0] * cellSize, p[1] * cellSize]),
        )}
        fill="none"
        stroke-width={3}
        stroke-linecap="round"
      />
    {/each}
    {#each circles as c, i}
      <circle
        {...center([c[0] * cellSize, c[1] * cellSize])}
        r={cellSize / 6}
        fill={colors.palette[i]}
      />
    {/each}
  </svg>
</Wrapper>

<style>
  svg {
    overflow: visible;
  }
</style>
