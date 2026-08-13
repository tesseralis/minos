<script lang="ts">
  import NavAndContent from "$lib/components/NavAndContent"
  import MinoList from "$lib/components/MinoList"
  import { page } from "$app/state"
  import { type FilterOptions } from "$lib/components/MinoList/MinoFilter"
  import { defaultValue } from "$lib/components/MinoList/MinoFilter/common"
  import { pageTitle } from "$lib/components/theme"

  const { children } = $props()
  const mino = $derived(page.data.mino)
  let filter = $state<FilterOptions>({
    ...defaultValue,
    yesNo: { hasTiling: "yes" },
  })
</script>

<svelte:head>
  <title>{pageTitle("Tiling")}</title>
</svelte:head>

<NavAndContent columns="24rem 1fr">
  {#snippet nav()}
    <MinoList
      bind:filter
      selected={mino}
      href={(mino) => `/tiling/${mino.toString()}`}
    />
  {/snippet}
  {@render children()}
</NavAndContent>
