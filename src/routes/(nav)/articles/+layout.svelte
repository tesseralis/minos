<script lang="ts">
  const { children } = $props()
</script>

<div class="wrapper">
  {@render children()}
</div>

<style>
  .wrapper {
    padding: 2rem 4rem;
    max-width: 72rem;
  }
</style>
