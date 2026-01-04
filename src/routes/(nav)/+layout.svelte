<script lang="ts">
  import Nav from "$lib/components/Nav"

  const { children } = $props()
</script>

<div class="container">
  <div class="nav-wrapper">
    <Nav />
  </div>
  <div class="content-wrapper">
    {@render children()}
  </div>
</div>

<style>
  .container {
    display: grid;
    position: fixed;
    width: 100vw;
    height: 100dvh;

    grid-template-rows: 48px 1fr;

    @media (min-width: 64rem) {
      grid-template-columns: 10rem 1fr;
      grid-template-rows: 1fr;
    }
  }

  .nav-wrapper {
    @media (min-width: 64rem) {
      margin-top: 2rem;
    }
  }

  .content-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }
</style>
