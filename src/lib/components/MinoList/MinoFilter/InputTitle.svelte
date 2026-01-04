<script lang="ts">
  const { display, onclear } = $props()
</script>

<div class="container">
  {display}
  <button type="button" onclick={onclear}>clear</button>
</div>

<style>
  .container {
    font-size: 1.125rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 4rem;
  }

  button {
    /* TODO (refactor) factor out this button style */
    font-size: 1rem;
    font-family: serif;
    margin-left: 1rem;
    padding: 0;
    text-align: right;
    color: var(--color-fg);
    background: none;
    border: none;
    cursor: pointer;
  }
  button:hover {
    color: var(--color-highlight);
  }
</style>
