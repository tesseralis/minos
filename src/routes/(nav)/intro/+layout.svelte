<script lang="ts">
  import { pageTitle } from "$lib/components/theme"

  const { children } = $props()
</script>

<svelte:head>
  <title>{pageTitle("Introduction")}</title>
</svelte:head>

<div class="intro">
  <div class="text-wrapper">
    {@render children()}
  </div>
</div>

<style>
  .intro {
    display: flex;
    justify-content: center;
  }

  .text-wrapper {
    max-width: 800px;
    width: 100%;
    padding: 1rem;
    font-size: 1.25rem;
  }

  .text-wrapper :global(h1) {
    text-align: center;
    font-size: 3rem;
    padding: 1.5rem;
  }
</style>
