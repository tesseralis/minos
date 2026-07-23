<script lang="ts">
  import { capitalize, range } from "lodash-es"
  import { page } from "$app/state"
  import NavAndContent from "$lib/components/NavAndContent"
  import ClassIcon from "$lib/components/ClassIcon.svelte"
  import HierachyArrow from "$lib/components/HierachyArrow.svelte"
  import { getClassColor } from "$lib/components/graph"
  import { DirClass } from "$lib/mino"
  import { escapeClass } from "./helpers"
  import type { LayoutProps } from "./$types"
  import ClassSymbol from "./ClassSymbol.svelte"
  import { pageTitle } from "$lib/components/theme"

  const { children }: LayoutProps = $props()

  const rowRanges: [number, number][] = [
    [0, 0],
    [2, 8],
    [1, 9],
    [3, 7],
  ]
</script>

<svelte:head>
  <title>{pageTitle("Directedness Classes")}</title>
</svelte:head>

<NavAndContent columns="20rem 1fr">
  {#snippet nav()}
    <div class="nav">
      <div class="subsection-links">
        {#each DirClass.all() as cls}
          {const route = `/classes/${escapeClass(cls.name())}`}
          {const isActive = page.url.pathname === route}
          <a href={route} class:active={isActive} style:grid-area={cls.code()}>
            <ClassIcon
              class={cls}
              fill="none"
              stroke={getClassColor(cls.name())}
              size={50}
            />
            {capitalize(cls.name())}
            <div class="symbol">
              <ClassSymbol dirClass={cls} />
            </div>
          </a>
        {/each}
        {#each range(1, 4) as col}
          {#each range(...rowRanges[col]) as row}
            {const direction = (row + col) % 2 === 0 ? "up left" : "up right"}
            <div
              class="arrow"
              style:grid-area="{row} / {col} / span 2 / span 2"
            >
              <HierachyArrow {direction} size={15} />
            </div>
          {/each}
        {/each}
      </div>
      <a class="table-link" href="/classes/table">Full Table</a>
    </div>
  {/snippet}
  {@render children()}
</NavAndContent>

<style>
  .nav {
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .subsection-links {
    display: grid;
    align-content: start;
    gap: 0.125rem 0;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-template-areas:
      ".     .     rect  ."
      ".     wedge rect  ."
      "stair wedge stack ."
      "stair fork  stack bar"
      "diam  fork  wing  bar"
      "diam  cres  wing  ant"
      "range cres  btree ant"
      "range tree  btree ."
      ".     tree  other ."
      ".     .     other .";
  }

  .subsection-links a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.25rem;
    line-height: 1;
    text-decoration: none;

    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 150ms ease-in-out;
  }
  .subsection-links a.active {
    color: var(--color-highlight);
  }
  .subsection-links a:hover {
    background-color: var(--color-bg2);
  }
  .subsection-links .symbol {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  .arrow {
    justify-self: center;
    align-self: center;
  }

  .table-link {
    font-size: 1.5rem;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    transition: background-color 150ms ease-in-out;
  }

  .table-link:hover {
    background-color: var(--color-bg2);
  }
</style>
