<script lang="ts">
  import { Polyomino } from "$lib/mino"
  import MinoLink from "$lib/components/MinoLink.svelte"
  import { getSymmetryColor } from "$lib/components/graph"
  import SymmetryMarkers from "$lib/components/SymmetryMarkers.svelte"

  const minos = [
    ["none", "0010_1111_0110_0100"],
    ["axis", "111_111_101"],
    ["diag", "111_111_011"],
    ["rot", "100_111_111_001"],
    ["axis2", "010_111_111_010"],
    ["diag2", "0100_1110_0111_0010"],
    ["rot2", "0100_0111_1110_0010"],
    ["all", "111_101_111"],
  ] as const
</script>

<div class="wrapper">
  {#each minos as [symmetry, minoStr]}
    {@const mino = Polyomino.of(minoStr)}
    {@const color = getSymmetryColor(symmetry)}
    {@const size = 15}
    <MinoLink
      {mino}
      {size}
      href="/catalog/{minoStr}"
      --stroke="black"
      --fill="hsl(from {color} h max(0, calc(s - 40)) l)"
    >
      <SymmetryMarkers {mino} {size} stroke="white" />
    </MinoLink>
  {/each}
</div>

<style>
  .wrapper {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
</style>
