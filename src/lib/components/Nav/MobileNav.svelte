<script lang="ts">
  import MenuIcon from "virtual:icons/mdi/menu"
  import { NavigationMenu as NavMenu } from "bits-ui"
  import Logo from "../Logo.svelte"
  import { navLinks } from "./helpers"
  import { page } from "$app/state"
</script>

<div class="container">
  <NavMenu.Root>
    <NavMenu.List>
      <NavMenu.Item openOnHover={false}>
        <NavMenu.Trigger>
          <MenuIcon />
        </NavMenu.Trigger>
        <NavMenu.Content>
          <ul>
            {#each navLinks as view}
              <li>
                <NavMenu.Link
                  href="/{view}"
                  class="nav-link"
                  data-active={page.url.pathname.startsWith(`/${view}`)}
                >
                  {view}
                </NavMenu.Link>
              </li>
            {/each}
          </ul>
        </NavMenu.Content>
      </NavMenu.Item>
      <NavMenu.Item>
        <NavMenu.Link href="/" class="home-link">
          <Logo />
        </NavMenu.Link>
      </NavMenu.Item>
    </NavMenu.List>
    <div class="viewport-wrapper"><NavMenu.Viewport /></div>
  </NavMenu.Root>
</div>

<style>
  .container :global([data-navigation-menu-root]) {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--color-bg);
    height: 3rem;
    width: 100vw;
    z-index: 1;
    border-bottom: 1px solid var(--color-border);
  }

  .container :global([data-navigation-menu-list]) {
    display: grid;
    padding: 4px;
    margin: 0;
    grid-template-columns: 2rem 1fr 2rem;
    justify-items: center;
    width: 100vw;
  }

  .container :global([data-navigation-menu-trigger]) {
    background: none;
    border: none;
    color: var(--color-fg);
    font-family: serif;
    font-size: 1.25rem;
  }

  .container :global([data-navigation-menu-content]) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  ul {
    margin: 0;
  }

  .container :global(.nav-link) {
    display: block;
    font-size: 1.25rem;
    line-height: 1.25;
    color: var(--color-fg);
    text-decoration: none;
    padding: 0.25rem 1rem;
  }

  .container :global(.nav-link[data-active="true"]) {
    color: var(--color-highlight);
  }

  .container :global(.nav-link:hover) {
    background-color: var(--color-bg2);
  }

  @media (pointer: coarse) {
    .container :global(.nav-link) {
      padding: 0.5rem 1rem;
    }
  }

  .container :global(.home-link) :global(svg) {
    width: 30px;
  }

  .viewport-wrapper {
    position: absolute;
    display: flex;
    width: 100%;
    top: 100%;
    left: 0;
    perspective: 2000px;
  }

  .container :global([data-navigation-menu-viewport]) {
    position: relative;
    transform-origin: top left;
    overflow: hidden;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg);
    height: var(--bits-navigation-menu-viewport-height);

    width: 100%;
  }

  @media (min-width: 40rem) {
    .container :global([data-navigation-menu-viewport]) {
      width: 8rem;
      border: 1px solid var(--color-border);
    }
  }
</style>
