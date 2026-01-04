<script lang="ts">
  import Polyline from "$lib/components/svg/Polyline.svelte"
  import { colors } from "$lib/components/theme"
  import Wrapper from "./Wrapper.svelte"

  const cellSize = 30
  const lines = [
    [
      [2, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 3],
      [0, 3],
      [0, 4],
    ],
    [
      [0, 4],
      [2, 4],
    ],
    [
      [2, 4],
      [2, 3],
    ],
    [
      [2, 3],
      [2, 2],
      [3, 2],
      [3, 0],
      [2, 0],
    ],
  ]
</script>

<Wrapper>
  <svg width={cellSize * 3} height={cellSize * 4}>
    {#each lines as points, i}
      <Polyline
        stroke={colors.palette[(i % 3) + 1]}
        fill="none"
        stroke-width={3}
        stroke-linecap="round"
        points={points.map((point) => [
          point[0] * cellSize,
          point[1] * cellSize,
        ])}
      />
    {/each}
  </svg>
</Wrapper>

<style>
  svg {
    overflow: visible;
  }
</style>
