<script lang="ts">
  import { O_OCTOMINO } from "$lib/mino"
  import Vector from "$lib/vector"
  import { getMinoColor, NUM_GENERATIONS } from "../graph"
  import { point } from "../svgUtils"
  import { colors } from "../theme"
  import { getMinoSizeAndTransform } from "./helpers.svelte"
  import SelectableSquare from "./SelectableSquare.svelte"

  let { highlight, mino = $bindable() } = $props()
  const { fill, stroke } = $derived(getMinoColor(mino))
</script>

<g>
  {#key mino}
    {#if mino.equals(O_OCTOMINO)}
      {@render hole()}
    {/if}
    {@render innerSquares(highlight)}
    {@render outerSquares()}
  {/key}
</g>

{#snippet innerSquares(highlight: boolean)}
  <g class="inner" class:highlight>
    {#each mino.relatives.possibleParents() as link}
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
      {#each mino.relatives.enumerateChildren() as link}
        <SelectableSquare {link} bind:selected={mino} />
      {/each}
    </g>
  {/if}
{/snippet}

{#snippet hole()}
  {@const { size, transform } = getMinoSizeAndTransform(mino)}
  <rect
    {...point(transform(new Vector(1, 1)))}
    width={size}
    height={size}
    fill={colors.bg}
    stroke="none"
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
</style>
