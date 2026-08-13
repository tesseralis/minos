<script lang="ts">
  import { pageTitle } from "$lib/components/theme"

  const { children } = $props()
</script>

<svelte:head>
  <title>{pageTitle("Links")}</title>
</svelte:head>

<div class="container">
  <div class="text-wrapper">
    {@render children()}
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
  }

  .text-wrapper {
    max-width: 800px;
    width: 100%;
    padding: 1rem;
  }
</style>
