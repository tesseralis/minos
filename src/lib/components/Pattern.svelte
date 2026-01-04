<script lang="ts">
  import { parsePattern } from "$lib/mino"
  import PatternMino from "./PatternMino.svelte"

  interface Props {
    pattern: string
  }

  // FIXME animation
  const maxWidth = 500
  const { pattern: patternStr }: Props = $props()
  const pattern = $derived(parsePattern(patternStr))

  const grid = $derived(
    patternStr
      .trim()
      .split("\n")
      .map((row) => [...row]),
  )

  const width = $derived(grid[0].length)
  const height = $derived(grid.length)
  const blockSize = $derived(Math.min(maxWidth / width, 40))

  const blockWidth = $derived(width * blockSize)
  const blockHeight = $derived(height * blockSize)
</script>

<svg
  viewBox="0 0 {blockWidth} {blockHeight}"
  style:aspect-ratio="{width} / {height}"
>
  {#each pattern as { mino, coord }}
    <PatternMino {mino} {coord} {blockSize} isSelected={false} />
  {/each}
</svg>

<style>
  svg {
    overflow: visible;
  }
</style>
