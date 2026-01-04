<script lang="ts">
  import { Polyomino, type Symmetry } from "$lib/mino"
  import MinoDiv from "./MinoDiv.svelte"
  import tinycolor from "tinycolor2"
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
  const minoStroke = $derived(tinycolor(stroke).setAlpha(0.5).toString())
</script>

<div class="wrapper">
  <MinoDiv
    {mino}
    {fill}
    stroke={minoStroke}
    size={size / mino.height}
    gridStyle="none"
  >
    <SymmetryMarkers {mino} size={size / mino.height} {stroke} />
  </MinoDiv>
</div>

<style>
  .wrapper :global(svg) {
    overflow: visible;
  }
</style>
