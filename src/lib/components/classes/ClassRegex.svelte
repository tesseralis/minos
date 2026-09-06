<script lang="ts">
  import { getDirColor } from "./helpers"

  const { dirClass } = $props()

  const regex = $derived(dirClass.regex())
  const parts = $derived(regex.match(/ru|lu|ld|rd|\(|\)|\||\*/g) ?? [])
</script>

<div class="regex">
  {#each parts as part}
    <span style:color={getDirColor(part)}>{part}</span>
  {/each}
</div>

<style>
  .regex {
    font-family: monospace;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
</style>
