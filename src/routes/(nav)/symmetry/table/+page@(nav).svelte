<script>
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { printSymmetry, symmetries } from "$lib/mino"
  import { capitalize } from "lodash-es"
  import MinoList from "../MinoList.svelte"
</script>

<div class="container">
  <Breadcrumbs
    paths={[
      ["Symmetry", "/symmetry"],
      ["Table", "/symmetry/table"],
    ]}
  />
  <main>
    {#each symmetries as symmetry}
      <section style:grid-area={symmetry}>
        <h2>
          <a href="/symmetry/{symmetry}"
            >{capitalize(printSymmetry(symmetry))}</a
          >
        </h2>
        <MinoList {symmetry} />
      </section>
    {/each}
  </main>
</div>

<style>
  .container {
    padding: 2rem;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 40rem) {
    main {
      display: grid;
      grid-template-areas:
        ".     all  ."
        "axis2 rot2 diag2"
        "axis  rot  diag"
        "none  none none";
    }
  }

  section {
    border: 1px solid grey;
    padding: 1rem;
  }

  h2 {
    margin: 0;
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
  }
</style>
