<script lang="ts">
  import NavAndContent from "$lib/components/NavAndContent"
  import { pageTitle } from "$lib/components/theme"

  const { children } = $props()
</script>

<svelte:head>
  <title>{pageTitle("Articles")}</title>
</svelte:head>

<NavAndContent columns="18rem 1fr">
  {#snippet nav()}
    <div class="nav-wrapper">
      <ul>
        <li><a href="directedness-0">Directedness</a></li>
        <li><a href="directedness-1">Directedness 1</a></li>
        <li><a href="directedness-2">Directedness 2</a></li>
        <li><a href="directedness-3">Directedness 3</a></li>
        <li><a href="directedness-4">Directedness 4</a></li>
      </ul>
    </div>
  {/snippet}
  {@render children()}
</NavAndContent>
