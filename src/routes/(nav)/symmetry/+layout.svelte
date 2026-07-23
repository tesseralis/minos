<script lang="ts">
  import NavAndContent from "$lib/components/NavAndContent"
  import { page } from "$app/state"
  import { capitalize } from "lodash-es"
  import { printSymmetry, symmetries } from "$lib/mino"
  import SymmetryIcon from "$lib/components/SymmetryIcon.svelte"
  import { getSymmetryColor } from "$lib/components/graph"
  import HierachyArrow from "$lib/components/HierachyArrow.svelte"
  import { pageTitle } from "$lib/components/theme"

  const { children } = $props()

  const arrows: [(string | number)[], string][] = [
    [["all", "rot2"], "up"],
    [["a", "rot2"], "up right"],
    [["all", "diag2"], "up left"],
    [["axis2", "axis"], "up"],
    [["axis2", "rot"], "up left"],
    [["rot2", "rot"], "up"],
    [["rot2", "diag"], "up right"],
    [["diag2", "diag"], "up"],
    [["axis", "none"], "up left"],
    [["rot", "none"], "up"],
    [["rot", "d"], "up right"],
  ]
</script>

<svelte:head>
  <title>{pageTitle("Symmetries and Transformations")}</title>
</svelte:head>

<NavAndContent columns="20rem 1fr">
  {#snippet nav()}
    <div class="nav">
      <div class="subsection-links">
        {#each symmetries as symmetry}
          {const route = `/symmetry/${symmetry}`}
          {const isActive = page.url.pathname === route}
          {const name = capitalize(printSymmetry(symmetry))}
          <!--
          split into two lines based on where the first space is
          https://stackoverflow.com/a/4607799 (why is JS so bad)
           -->
          {const [first, last] = name.split(/ (.*)/)}
          <a
            href={route}
            style:grid-area={symmetry}
            class:active={isActive}
            data-area={symmetry}
          >
            <SymmetryIcon
              {symmetry}
              size={50}
              fill="none"
              stroke={getSymmetryColor(symmetry)}
            />
            {#if last}
              {first}<br />{last}
            {:else}
              {first}
            {/if}
          </a>
        {/each}
        {#each arrows as [gridArea, direction]}
          <div
            class="arrow"
            style:grid-area={gridArea.flatMap((x) => [x, x]).join(" / ")}
          >
            <HierachyArrow {direction} size={20} />
          </div>
        {/each}
      </div>
      <a class="table-link" href="/symmetry/table">Full Table</a>
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
    justify-content: center;
    width: 100%;
    gap: 2rem;
  }

  .subsection-links {
    display: grid;
    gap: 2rem 0;
    align-content: start;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas:
      "a     all  b"
      "axis2 rot2 diag2"
      "axis  rot  diag"
      "c     none d";
    [data-area="all"] {
      align-self: end;
    }
  }

  .subsection-links a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.25rem;
    padding: 0.5rem;
    padding-top: 0.75rem;
    text-decoration: none;
    border-radius: 4px;

    transition: background-color 150ms ease-in-out;
  }
  .subsection-links a:hover {
    background-color: var(--color-bg2);
  }
  .subsection-links a.active {
    color: var(--color-highlight);
  }

  .arrow {
    align-self: center;
    justify-self: center;
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
