<script lang="ts">
  import { Dialog } from "bits-ui"
  import GridIcon from "virtual:icons/mdi/dots-grid"
  import CloseIcon from "virtual:icons/mdi/close"
  import { fade, fly } from "svelte/transition"

  const { children } = $props()
  let open = $state(false)

  function handleWindowClick(e: MouseEvent) {
    if (!open) {
      return
    }
    if (e.target instanceof Element && e.target?.closest("a")) {
      open = false
    }
  }
</script>

<svelte:window onclick={handleWindowClick} />
<div class="container">
  <Dialog.Root bind:open>
    <Dialog.Trigger><GridIcon /></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade class="overlay"></div>
          {/if}
        {/snippet}
      </Dialog.Overlay>
      <Dialog.Content forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div class="content" {...props} transition:fly={{ x: "-100%" }}>
              {@render children()}
              <Dialog.Close><CloseIcon /></Dialog.Close>
            </div>
          {/if}
        {/snippet}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</div>

<style>
  .container :global([data-dialog-trigger]) {
    /* Set z-index because of katex formatting */
    z-index: 10;
    position: fixed;
    left: 0;
    bottom: 1rem;
    background: var(--color-bg);

    padding: 0.75rem;
    padding-right: 1rem;

    display: flex;
    align-items: center;
    font-size: 1.75rem;
    color: var(--color-fg);

    border: 1px solid var(--color-border);
    border-left: none;
    border-top-right-radius: 9999px;
    border-bottom-right-radius: 9999px;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background-color: black;
    opacity: 25%;
  }

  .content {
    background-color: var(--color-bg);
    position: fixed;
    height: 100dvh;
    width: calc(100vw - 2rem);
    border-right: 1px solid var(--color-border);
    box-shadow: 2px 2px 8px #111;
    overflow-y: scroll;

    transition: transform 200ms ease-in;
  }

  .content :global([data-dialog-close]) {
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: none;
    border: none;
    color: var(--color-fg);
  }
</style>
