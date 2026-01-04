<script>
  import { navLinks } from "$lib/components/Nav"
</script>

<nav>
  {#each navLinks as link}
    {#if link !== "intro"}
      <a href="/{link}">{link}</a>
    {/if}
  {/each}
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    font-size: 1.5rem;
    text-align: center;
  }

  @media (min-width: 40rem) {
    nav {
      flex-direction: row;
    }
  }
</style>
