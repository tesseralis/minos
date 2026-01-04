<script lang="ts">
  import Logo from "$lib/components/Logo.svelte"
  import Pattern from "$lib/components/Pattern.svelte"
  import EnterLink from "./EnterLink.svelte"
  import Nav from "./Nav.svelte"
  import Title from "./Title.svelte"

  const { data } = $props()
</script>

<div class="home">
  <div class="pattern-wrapper">
    <Pattern pattern={data.pattern} />
  </div>
  <main>
    <Title />
    <EnterLink />
    <Nav />
    <div class="logo-wrapper">
      <Logo />
    </div>
  </main>
</div>

<style>
  .home {
    position: absolute;
    inset: 0;
    display: grid;
    overflow: hidden;
    grid-template-areas: "center";
  }

  .pattern-wrapper {
    grid-area: center;
    opacity: 12.5%;
    justify-self: center;
    align-self: center;
    overflow: hidden;
  }

  .pattern-wrapper :global(svg) {
    width: 100vmax;
  }

  main {
    grid-area: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 1000;
  }

  .logo-wrapper {
    margin-top: 2rem;
    width: 75px;
  }
</style>
