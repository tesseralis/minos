<script lang="ts">
  import NavAndContent from "$lib/components/NavAndContent"
  import MinoList from "$lib/components/MinoList"
  import { page } from "$app/state"
  import { type FilterOptions } from "$lib/components/MinoList/MinoFilter"

  const { children } = $props()
  const mino = $derived(page.data.mino)
  let filter = $state<FilterOptions>({
    symmetries: [],
    classes: [],
    yesNo: { hasTiling: "yes" },
  })
</script>

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
