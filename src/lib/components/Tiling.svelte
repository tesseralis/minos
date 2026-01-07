<script lang="ts">
  import type { Polyomino, Tiling as MinoTiling } from "$lib/mino"
  import type Vector from "$lib/vector"
  import { range } from "lodash-es"
  import { colors } from "./theme"
  import MinoSvg from "./MinoSvg.svelte"

  // Mod except it works for negative numbers
  function mod(n: number, d: number) {
    const rem = n % d
    return rem < 0 ? rem + d : rem
  }

  function mod2(n: number) {
    return mod(n, 2)
  }

  function getColor(domLength: number, i: number, j: number, patIdx: number) {
    switch (domLength) {
      // If the domain has only one mino,
      // then use a different color for each set of four
      case 1:
        return 2 * mod2(i) + mod2(j)
      // If it has two minos, use two of the colors for them and alternate based on the parity of i+j
      case 2:
        return 2 * mod2(i + j) + patIdx
      // Otherwise, color each mino in the domain differently
      default:
        return patIdx
    }
  }

  function inBounds(n: number, limit: number) {
    return n >= -limit && n <= limit
  }

  function inBox(p: Vector, size: number) {
    const halfSize = Math.ceil(size / 2)
    return inBounds(p.x, halfSize) && inBounds(p.y, halfSize)
  }

  interface Tile {
    coord: Vector
    mino: Polyomino
    // the color index
    color: number
  }

  // Get all the tiles that can be drawn on a square grid of the given size
  function* getTiles(tiling: MinoTiling, size: number): Generator<Tile> {
    const {
      basis: [u, v],
      domain,
    } = tiling
    for (const i of range(-size, size)) {
      for (const j of range(-size, size)) {
        for (const k of range(domain.data.length)) {
          const { coord, mino } = domain.data[k]
          const p = u.scale(i).add(v.scale(j)).add(coord)
          // Only add the tile if some point in the mino is visible within the grid
          if (mino.coords().some((c) => inBox(p.add(c), size))) {
            yield {
              coord: p,
              mino,
              color: getColor(domain.data.length, i, j, k),
            }
          }
        }
      }
    }
  }

  // How many svg units each square should be
  const squareSize = 20

  const { mino, gridSize } = $props()
  // Normalize the number of unit squares so that approximately 64 minos are shown
  // (for monominoes, this is the size of a checkerboard)
  // Also make sure that the side length is even
  const viewLength = $derived(squareSize * gridSize)
  const tiling = $derived(mino.tilings.get())
  const tilingColors = $derived(colors.palette)
</script>

<svg viewBox="{-viewLength / 2} {-viewLength / 2} {viewLength} {viewLength}">
  {#if tiling}
    {#each getTiles(tiling, gridSize) as { coord, mino, color }}
      <MinoSvg
        {mino}
        coord={coord.scale(squareSize)}
        size={squareSize}
        anchor="top left"
        gridStyle="thin"
        --fill={tilingColors[color]}
        --stroke="black"
      />
    {/each}
  {:else}
    <div>This polyomino does not tile the plane.</div>
  {/if}
</svg>

<style>
  svg {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
</style>
