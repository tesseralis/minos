<script lang="ts">
  import { Tooltip } from "bits-ui"
  import type { Snippet } from "svelte"

  interface Props extends Tooltip.RootProps {
    trigger: Snippet<[{ props: any }]>
  }

  let { children, trigger }: Props = $props()
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      {@render trigger({ props })}
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content class="mino-filter-tooltip-content">
      {@render children?.()}
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>

<style>
  :global(.mino-filter-tooltip-content) {
    background: var(--color-bg);
    border: 1px solid var(--outline-color);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }
</style>
