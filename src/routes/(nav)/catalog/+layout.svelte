<script lang="ts">
  import { page } from "$app/state"
  import MinoList from "$lib/components/MinoList"
  import NavAndContent from "$lib/components/NavAndContent"

  const { children } = $props()

  const mino = $derived(page.data.mino)
</script>

<NavAndContent columns="1fr 28rem">
  {#snippet nav()}
    <MinoList href={(mino) => `/catalog/${mino.toString()}`} selected={mino} />
  {/snippet}
  {@render children()}
</NavAndContent>
