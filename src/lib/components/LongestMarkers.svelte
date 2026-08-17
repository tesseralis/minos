<script lang="ts">
  import { Polyomino } from "$lib/mino"
  import type { SVGAttributes } from "svelte/elements"
  import { endpoints } from "./svgUtils"
  import Vector from "$lib/vector"

  interface Props extends SVGAttributes<EventTarget> {
    mino: Polyomino
    // The size to a cell of the polyomino
    size: number
  }

  const { mino, size, ...svgProps }: Props = $props()

  const [width, height] = $derived(mino.dims.map((dim) => dim * size))
  const mapPoint = (point: Vector) =>
    point.scale(size).sub([width / 2 - size / 2, height / 2 - size / 2])
</script>

{#each mino.longestLines() as line}
  <line
    {...svgProps}
    {...endpoints(
      mapPoint(Vector.fromPacked(line[0])),
      mapPoint(Vector.fromPacked(line.at(-1)!)),
    )}
  />
{/each}
{#each mino.longestWaves() as wave}
  <line
    {...svgProps}
    {...endpoints(
      mapPoint(Vector.fromPacked(wave[0])),
      mapPoint(Vector.fromPacked(wave.at(-1)!)),
    )}
  />
{/each}

<style>
  line {
    stroke-linecap: round;
  }
</style>
