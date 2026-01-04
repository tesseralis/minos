<script lang="ts">
  import NavAndContent from "$lib/components/NavAndContent"
  import { page } from "$app/state"

  const { data, children } = $props()
  const terms = data.terms
</script>

<NavAndContent columns="18rem 1fr">
  {#snippet nav()}
    <div class="nav-wrapper">
      <ul>
        {#each terms as term}
          {@const path = `/glossary/${term}`}
          <li>
            <a href={path} class:active={path === page.url.pathname}>
              {term.replace("-", " ")}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/snippet}
  {@render children()}
</NavAndContent>

<style>
  .nav-wrapper {
    padding: 2rem;
  }

  .nav-wrapper ul {
    margin: 0;
    line-height: 1.5;
    list-style: square;
  }

  .nav-wrapper a {
    text-decoration: none;
    font-size: 1.25rem;
  }

  .nav-wrapper a.active {
    color: var(--color-highlight);
  }
</style>
