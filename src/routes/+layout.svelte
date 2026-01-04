<script lang="ts">
  import "sanitize.css"
  import "./style.css"
  import { Tooltip } from "bits-ui"

  const { children } = $props()
</script>

<svelte:head>
  <title>The Labyrinth of Polyominoes</title>
</svelte:head>
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
