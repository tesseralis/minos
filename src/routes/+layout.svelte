<script lang="ts">
  import "sanitize.css"
  import "./style.css"
  import { Tooltip } from "bits-ui"

  const { children } = $props()
</script>

<svelte:head>
  <title>The Labyrinth of Polyominoes</title>
  <meta
    name="description"
    content="Interactive encyclopedia and shrine to polyominoes."
  />
</svelte:head>
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
