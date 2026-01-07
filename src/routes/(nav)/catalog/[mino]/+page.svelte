<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { NUM_GENERATIONS } from "$lib/components/graph"
  import MinoDiv from "$lib/components/MinoDiv.svelte"
  import MinoLink from "$lib/components/MinoLink.svelte"
  import { orderName, Polyomino, printSymmetry } from "$lib/mino"
  import { scaleLinear } from "d3-scale"
  import { escapeClass } from "../../classes/helpers"
  import Tiling from "$lib/components/Tiling.svelte"
  import { capitalize } from "lodash-es"
  import type { Snippet } from "svelte"

  const { data } = $props()
  const { mino } = $derived(data)
  const getBlockSize = scaleLinear().domain([1, NUM_GENERATIONS]).range([12, 8])
  const minoData: [string, Snippet<[Polyomino]>][] = [
    ["size", size],
    ["dimensions", dimensions],
    ["symmetry", symmetry],
    ["class", dirClass],
    ["tiling", tiling],
    ["parents", parents],
    ["children", children],
  ]
</script>

{#snippet minoDiv()}
  <MinoDiv
    {mino}
    size={Math.min(30 / mino.height, 15)}
    --fill="none"
    --stroke="currentcolor"
  />
{/snippet}

{#snippet minoList(minos: Polyomino[])}
  <div class="list">
    {#each minos as mino}
      <MinoLink
        {mino}
        href="/catalog/{mino.toString()}"
        size={getBlockSize(mino.order)}
      />
    {/each}
  </div>
{/snippet}

<div>
  <Breadcrumbs
    paths={[
      ["Catalog", "/catalog"],
      [minoDiv, `/catalog/${mino}`],
    ]}
  />
  <div class="header">
    <MinoDiv {mino} size={96 / mino.order} />
  </div>
  <dl>
    {#each minoData as [name, display]}
      <div style:grid-area={name}>
        <dt>{capitalize(name)}</dt>
        <dd>{@render display(mino)}</dd>
      </div>
    {/each}
  </dl>
</div>

{#snippet size(mino: Polyomino)}
  {mino.order} {orderName(mino.order)}
{/snippet}

{#snippet dimensions(mino: Polyomino)}
  {mino.dims.join(" × ")}
{/snippet}

{#snippet symmetry(mino: Polyomino)}
  <a href="/symmetry/{mino.transform.symmetry()}">
    {printSymmetry(mino.transform.symmetry())}
  </a>
{/snippet}

{#snippet dirClass(mino: Polyomino)}
  <a href="/classes/{escapeClass(mino.classes.get().name())}">
    {mino.classes.get().name()}
  </a>
{/snippet}

{#snippet tiling(mino: Polyomino)}
  {#if mino.tilings.has()}
    <div class="tiling">
      <a href="/tiling/{mino.toString()}">
        <Tiling {mino} gridSize={8} />
      </a>
    </div>
  {:else}
    ——
  {/if}
{/snippet}

{#snippet parents(mino: Polyomino)}
  {#if mino.order > 1}
    {@render minoList(Polyomino.sort([...mino.relatives.freeParents()]))}
  {:else}
    ——
  {/if}
{/snippet}

{#snippet children(mino: Polyomino)}
  {#if mino.order < NUM_GENERATIONS}
    {@render minoList(Polyomino.sort([...mino.relatives.freeChildren()]))}
  {:else}
    ——
  {/if}
{/snippet}

<style>
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    /* Constant height so lower parts don't shift down */
    height: 6rem;
  }

  dl {
    display: grid;
    grid-template-areas:
      "size dimensions"
      "symmetry class"
      "tiling tiling"
      "parents parents"
      "children children";
  }

  dt {
    font-size: 1.125rem;
  }

  dd {
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .tiling {
    position: relative;
    width: 100px;
  }
</style>
