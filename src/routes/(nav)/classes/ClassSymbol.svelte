<script lang="ts">
  import { page } from "$app/state"

  const { dirClass } = $props()
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags  -->
{@html page.data.classSymbols[dirClass.code()]}
