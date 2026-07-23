<script lang="ts">
  import type { Snippet } from "svelte"
  import MdiChevronRight from "virtual:icons/mdi/chevron-right"

  interface Props {
    paths: CrumbPath[]
  }

  type CrumbPath = [name: string | Snippet, url: string]

  const { paths }: Props = $props()
</script>

<nav>
  {@render breadcrumbPart(paths)}
</nav>

{#snippet breadcrumbPart(paths: CrumbPath[])}
  {const [name, url] = $derived(paths[0])}
  <a href={url}>
    {#if typeof name === "string"}
      {name}
    {:else}
      {@render name()}
    {/if}
  </a>
  {#if paths.length > 1}
    <MdiChevronRight />
    {@render breadcrumbPart(paths.slice(1))}
  {/if}
{/snippet}

<style>
  nav {
    margin-bottom: 1rem;
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  a {
    text-decoration: none;
  }
</style>
