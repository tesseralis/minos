<script lang="ts">
  import "sanitize.css"
  import "./style.css"
  import { Tooltip } from "bits-ui"
  import { SITE_TITLE } from "$lib/components/theme"

  const { children } = $props()
</script>

<svelte:head>
  <title>{SITE_TITLE}</title>
  <meta
    name="description"
    content="Interactive encyclopedia and shrine to polyominoes."
  />
</svelte:head>
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
