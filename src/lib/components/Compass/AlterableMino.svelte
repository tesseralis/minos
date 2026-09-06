<script lang="ts">
  import type { Coord, Polyomino } from "$lib/mino"
  import Vector from "$lib/vector"
  import { getMinoColor, NUM_GENERATIONS } from "../graph"
  import { point } from "../svgUtils"
  import { getMinoSizeAndTransform } from "./helpers.svelte"
  import SelectableSquare from "./SelectableSquare.svelte"

  interface Props {
    highlight: boolean
    mino: Polyomino
  }

  let { highlight, mino = $bindable() }: Props = $props()
  const { fill, stroke } = $derived(getMinoColor(mino))
</script>

<g>
  {#key mino}
    {#each mino.punctures() as puncture}
      {#each puncture as coord}
        {@render hole(coord)}
      {/each}
    {/each}
    {@render innerSquares(highlight)}
    {@render outerSquares()}
  {/key}
</g>

{#snippet innerSquares(highlight: boolean)}
  <g class="inner" class:highlight>
    {#each mino.possibleParents() as link}
      <SelectableSquare
        {link}
        bind:selected={mino}
        --fill={fill}
        --stroke={stroke}
      />
    {/each}
  </g>
{/snippet}

{#snippet outerSquares()}
  {#if mino.order < NUM_GENERATIONS}
    <g class="outer">
      {#each mino.enumerateChildren() as link}
        <SelectableSquare {link} bind:selected={mino} />
      {/each}
    </g>
  {/if}
{/snippet}

{#snippet hole(coord: Coord)}
  {@const { size, transform } = getMinoSizeAndTransform(mino)}
  <rect
    class="hole"
    {...point(transform(Vector.fromPacked(coord)))}
    width={size}
    height={size}
  />
{/snippet}

<style>
  .inner :global(rect) {
    fill: var(--fill);
    stroke: var(--stroke);
  }

  .inner.highlight :global(rect[data-selectable="true"]) {
    fill: color-mix(in oklch, var(--fill), white 20%);
  }

  .inner.highlight :global(rect[data-selected="true"]) {
    fill: color-mix(in oklch, var(--fill), white 80%);
  }

  .outer :global(rect) {
    stroke: grey;
    opacity: 0;
  }

  @media (hover: none) {
    .outer :global(rect) {
      stroke: grey;
      opacity: 0.5;
    }
  }

  .outer :global(rect[data-selected="true"]) {
    opacity: 0.5;
  }

  .hole {
    fill: var(--color-bg);
    stroke: none;
  }
</style>
