<script lang="ts">
  import { Polyomino, type Symmetry } from "$lib/mino"
  import MinoDiv from "./MinoDiv.svelte"
  import SymmetryMarkers from "./SymmetryMarkers.svelte"

  interface Props {
    symmetry: Symmetry
    fill: string
    stroke: string
    size: number
  }

  const minoMap: Record<Symmetry, string> = {
    all: "010_111_010",
    axis2: "101_111_101",
    diag2: "110_111_011",
    rot2: "0010_1110_0111_0100",
    axis: "100_111_100",
    diag: "100_110_011",
    rot: "001_111_100",
    none: "010_110_011",
  }

  const { symmetry, fill, stroke, size }: Props = $props()
  const mino = $derived(Polyomino.of(minoMap[symmetry]))
</script>

<div class="wrapper">
  <MinoDiv
    {mino}
    size={size / mino.height}
    gridStyle="none"
    --fill={fill}
    --stroke="hsl(from {stroke} h s l / 0.5)"
  >
    <SymmetryMarkers {mino} size={size / mino.height} {stroke} />
  </MinoDiv>
</div>

<style>
  .wrapper :global(svg) {
    overflow: visible;
  }
</style>
