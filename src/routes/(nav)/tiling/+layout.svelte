<script lang="ts">
  import NavAndContent from "$lib/components/NavAndContent"
  import MinoList from "$lib/components/MinoList"
  import { page } from "$app/state"

  const { children } = $props()
  const mino = $derived(page.data.mino)
</script>

<NavAndContent columns="24rem 1fr">
  {#snippet nav()}
    <MinoList
      initFilter={{ symmetries: [], classes: [], yesNo: { hasTiling: "yes" } }}
      selected={mino}
      href={(mino) => `/tiling/${mino.toString()}`}
    />
  {/snippet}
  {@render children()}
</NavAndContent>
