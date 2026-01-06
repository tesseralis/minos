<script lang="ts">
  const { width, children } = $props()
  const height = $derived((width / 16) * 9)
  const viewBox = $derived(`-${width / 2} ${-height / 10} ${width} ${height}`)
</script>

<svg {viewBox}>
  {@render children()}
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
    background-color: var(--color-bg);
  }
</style>
