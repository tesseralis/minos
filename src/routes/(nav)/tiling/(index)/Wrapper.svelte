<script lang="ts">
  const { children } = $props()
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    width: 100%;
    margin: 2rem 0;
    display: flex;
    justify-content: center;
  }
</style>
