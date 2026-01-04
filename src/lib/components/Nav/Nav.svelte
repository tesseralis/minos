<script lang="ts">
  import Responsive from "../Responsive.svelte"
  import { page } from "$app/state"
  import MobileNav from "./MobileNav.svelte"
  import { navLinks } from "./helpers"
</script>

<Responsive query="(min-width: 64rem)" match={desktopNav} default={mobileNav} />

{#snippet desktopNav()}
  <nav class="desktop-nav">
    {@render title()}
    <ul>
      {#each navLinks as view}
        <li>
          <a
            href="/{view}"
            class:active={page.url.pathname.startsWith(`/${view}`)}>{view}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
{/snippet}

{#snippet mobileNav()}
  <div class="mobile-nav"><MobileNav /></div>
{/snippet}

{#snippet title()}
  <a class="title" href="/">
    <span>The labyrinth of</span>polyominoes
  </a>
{/snippet}

<style>
  .desktop-nav {
    font-family: serif;
    margin-left: 2rem;
  }

  .desktop-nav a {
    font-size: 1.25rem;
    line-height: 1.25;
    color: var(--color-fg);
    text-decoration: none;
  }
  .desktop-nav a.active {
    color: var(--color-highlight);
  }
  .desktop-nav a:hover {
    text-decoration: underline;
  }

  a.title {
    display: flex;
    flex-direction: column;
    font-weight: normal;
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--color-highlight);
    line-height: 1;
    font-size: 1.5rem;
    text-decoration: none;
  }

  a.title span {
    margin-left: 0.0625rem;
    font-size: 1rem;
  }

  /* Responsive stylings */
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }

  @media (min-width: 64rem) {
    .desktop-nav {
      display: block;
    }

    .mobile-nav {
      display: none;
    }
  }
</style>
