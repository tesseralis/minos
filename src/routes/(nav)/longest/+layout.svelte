<script>
  import { NUM_GENERATIONS } from "$lib/components/graph"
  import NavAndContent from "$lib/components/NavAndContent"
  import { orderName } from "$lib/mino"
  import { range } from "lodash-es"

  const { children } = $props()
</script>

<NavAndContent columns="20rem 1fr">
  {#snippet nav()}
    <div>
      {#each range(2, NUM_GENERATIONS + 1) as n}
        <div>
          <h2>{orderName(n)}</h2>
          <div class="table" style:--num-columns={n}>
            <div style:grid-row={2} style:grid-column={n}>({2}, {n})</div>
            <div style:grid-row={n} style:grid-column={2}>({n}, {2})</div>
            {#each range(3, n + 1) as l}
              {#each range(3, n + 2 - l + 1) as w}
                <div style:grid-row={l} style:grid-column={w}>
                  <a href="/longest/{n}-{l}-{w}">
                    ({l}, {w})
                  </a>
                </div>
              {/each}
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/snippet}
  <div>{@render children()}</div>
</NavAndContent>

<style>
  .table {
    display: grid;
    grid-template-columns: repeat(1fr, var(--num-columns));
  }
</style>
