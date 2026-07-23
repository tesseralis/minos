<script lang="ts">
  import { page } from "$app/state"
  import NavAndContent from "$lib/components/NavAndContent"
  import { pageTitle } from "$lib/components/theme"
  import { getSizeText, getShapeText } from "./helpers"

  const { children } = $props()
  const sizes = ["1_4", 5, 6, 7, 8]
  const shapes = ["rect", "square"]
</script>

<svelte:head>
  <title>{pageTitle("Packing")}</title>
</svelte:head>

<NavAndContent columns="18rem 1fr">
  {#snippet nav()}
    <div class="nav">
      {#each sizes as size}
        <section>
          <h2>
            {getSizeText(size)}
          </h2>
          <div>
            {#each shapes as shape}
              {const route = `/packing/${size}-${shape}`}
              {const isActive = page.url.pathname.startsWith(route)}
              <a href={route} class:active={isActive}>
                {getShapeText(shape)}
              </a>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/snippet}
  {@render children()}
</NavAndContent>

<style>
  .nav {
    margin-top: 2rem;
  }

  .nav section {
    padding: 1rem;
  }

  .nav section:not(:last-child) {
    border-bottom: 1px solid var(--color-fg);
  }

  .nav h2 {
    font-size: 1.25rem;
    margin: 0;
  }

  .nav a {
    font-size: 1.125rem;
    margin-right: 0.5rem;
    color: var(--color-fg);
    text-decoration: none;
  }

  .nav a.active {
    color: var(--color-highlight);
    text-decoration: underline;
  }
</style>
