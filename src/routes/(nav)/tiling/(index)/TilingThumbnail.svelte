<script lang="ts">
  import Tiling from "$lib/components/Tiling.svelte"
  import Wrapper from "./Wrapper.svelte"

  const { mino } = $props()
</script>

<Wrapper>
  <div>
    <a href="/tiling/{mino.toString()}">
      <Tiling {mino} gridSize={16} />
    </a>
  </div>
</Wrapper>

<style>
  div {
    position: relative;
    width: 200px;
  }
</style>
