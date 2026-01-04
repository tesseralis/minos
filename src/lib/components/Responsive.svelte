<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { MediaQuery } from "svelte/reactivity"

  interface Props {
    query: string
    // What to show when the query matches
    match: Snippet
    // What to show when it doesn't
    default: Snippet
  }

  const { query, match, default: def }: Props = $props()

  const isMatch = $derived(new MediaQuery(query))
  let mounted = $state(false)

  onMount(() => {
    // mounted = true
  })
</script>

{#if !mounted || isMatch.current}
  {@render match()}
{/if}
{#if !mounted || !isMatch.current}
  {@render def()}
{/if}
