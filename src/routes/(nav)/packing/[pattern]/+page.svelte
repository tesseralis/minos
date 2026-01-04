<script lang="ts">
  import Pattern from "$lib/components/Pattern.svelte"
  import { getAttribution } from "../helpers.svelte"

  const { data } = $props()
  const pattern = $derived(data.pattern)
  const attribution = $derived(getAttribution(data.patternName))
</script>

<div class="container">
  <div class="pattern">
    <Pattern {pattern} />
    <div class="attribution">
      {@render attribution()}
    </div>
  </div>
</div>

<style>
  .container {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .pattern {
    align-self: center;
    width: 100%;
    max-width: 90vmin;
    max-height: 90vmin;
  }

  .attribution {
    margin: 1rem;
    text-align: center;
  }
</style>
