<script lang="ts">
  import { orderName } from "$lib/mino"

  const { gen, count, children } = $props()
</script>

<section>
  <div class="header">
    <h2>
      {orderName(gen, gen > 2)} <span>(𝑛 = {gen})</span>
    </h2>
    <span class="count">{count}</span>
  </div>
  {@render children()}
</section>

<style>
  section {
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max-content;
    flex-grow: 1;
  }
  section:not(:last-child) {
    border-bottom: 1px var(--color-fg) solid;
  }

  .header {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 2rem;
    justify-content: space-around;
    padding: 0 1rem;
    margin-bottom: 0.75rem;
  }

  h2 {
    font-size: 1.25rem;
    margin: 0;
  }
  h2 span {
    font-size: 0.875rem;
  }

  .count {
    font-size: 1rem;
    justify-self: end;
  }
</style>
