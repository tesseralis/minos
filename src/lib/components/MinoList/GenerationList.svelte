<script lang="ts">
  import { scaleLinear } from "d3-scale"
  import { getMinoColor, NUM_GENERATIONS } from "../graph"
  import GenSection from "./GenSection.svelte"
  import MinoLink from "../MinoLink.svelte"
  import { colors } from "../theme"

  const { minos, gen, href, selected } = $props()
  const getBlockSize = scaleLinear()
    .domain([1, NUM_GENERATIONS])
    .range([18, 10])
</script>

<GenSection {gen} count={minos.length}>
  <div class="container">
    {#if minos.length === 0}
      ——
    {:else}
      {#each minos as mino}
        {@const isSelected = !!selected && mino.transform.equivalent(selected)}
        {@const { stroke, fill } = getMinoColor(mino)}
        <MinoLink
          {mino}
          {fill}
          stroke={isSelected ? colors.highlight : stroke}
          size={getBlockSize(mino.order)}
          href={href(mino)}
        />
      {/each}
    {/if}
  </div>
</GenSection>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .container > :global(*) {
    margin: 0.5rem;
  }
</style>
