<script lang="ts">
  import type { Snippet } from "svelte"
  import Responsive from "../Responsive.svelte"
  import MobileNavDialog from "./MobileNavDialog.svelte"

  interface Props {
    nav: Snippet
    children: Snippet
    columns: string
  }

  const { nav, children, columns }: Props = $props()
</script>

<div class="container" style:grid-template-columns={columns}>
  <Responsive
    query="(min-width: 40rem)"
    match={desktopNav}
    default={mobileNavDialog}
  />
  <main>
    {@render children()}
  </main>
</div>

{#snippet desktopNav()}
  <nav class="desktop-nav">
    {@render nav()}
  </nav>
{/snippet}

{#snippet mobileNavDialog()}
  <div class="mobile-nav">
    <MobileNavDialog>{@render nav()}</MobileNavDialog>
  </div>
{/snippet}

<style>
  .container {
    height: 100%;
  }
  @media (min-width: 40rem) {
    .container {
      display: grid;
      gap: 2rem;
    }
  }

  .container .desktop-nav {
    overflow-y: scroll;
  }

  main {
    width: 100%;
    height: 100%;
    padding: 2rem;
    padding-bottom: 4rem;
    overflow-y: scroll;
  }

  /* Toggle displays server-side */
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }

  @media (min-width: 40rem) {
    .desktop-nav {
      display: block;
    }

    .mobile-nav {
      display: none;
    }
  }
</style>
