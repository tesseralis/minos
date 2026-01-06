<script lang="ts">
  import { getMinoColor } from "$lib/components/graph"
  import MinoLink from "$lib/components/MinoLink.svelte"
  import { Polyomino } from "$lib/mino"

  const minos = [
    "1",
    "01_11",
    "010_111",
    "101_111",
    "110_101_111",
    "0010_1110_0111_0100",
  ]
</script>

<div class="mino-list">
  {#each minos as minoStr}
    {@const mino = Polyomino.fromString(minoStr)}
    {@const { stroke, fill } = getMinoColor(mino)}
    <MinoLink
      {mino}
      href={`catalog/${mino.transform.free()}`}
      size={15}
      --stroke={stroke}
      --fill={fill}
    />
  {/each}
</div>

<style>
  .mino-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  @media (min-width: 40rem) {
    .mino-list {
      gap: 2rem;
    }
  }
</style>
