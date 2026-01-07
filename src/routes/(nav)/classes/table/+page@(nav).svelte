<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  // @ts-expect-error Issues importing SVX
  import Text from "./Text.svx"
  import { DirClass } from "$lib/mino"
  import { capitalize } from "lodash-es"
  import { escapeClass } from "../helpers"
  import ClassRegex from "../ClassRegex.svelte"
  import ClassList from "../ClassList.svelte"
  import ClassSymbol from "../ClassSymbol.svelte"

  const arrowPositions = [
    { row: 1, column: "4 / span 3" },
    { row: 2, column: 3 },
    { row: 2, column: "4 / span 3" },
    { row: 3, column: "1 / span 3" },
    { row: 3, column: 4 },
    { row: 3, column: "5 / span 2" },
    { row: 4, column: "1 / span 2" },
    { row: 4, column: "3 / span 2" },
    { row: 4, column: "5 / span 2" },
    { row: 5, column: "1 / span 2" },
    { row: 5, column: "3 / span 3" },
    { row: 5, column: 6 },
    { row: 6, column: "1 / span 3" },
    { row: 6, column: "4 / span 2" },
    { row: 6, column: 6 },
    { row: 7, column: "2 / span 2" },
    { row: 7, column: "4 / span 2" },
    { row: 8, column: "2 / span 4" },
  ]
</script>

<div class="page">
  <Breadcrumbs
    paths={[
      ["Classes", "/classes"],
      ["Table", "/classes/table"],
    ]}
  />
  <main>
    <div class="info">
      <Text />
    </div>
    {#each DirClass.all() as dirClass}
      <section style:grid-area={dirClass.code()}>
        <h2>
          <a href="/classes/{escapeClass(dirClass.name())}">
            {capitalize(dirClass.name())}
          </a>
          <ClassSymbol {dirClass} />
        </h2>
        <ClassRegex {dirClass} />
        <ClassList {dirClass} />
      </section>
    {/each}
    {#each arrowPositions as { row, column }}
      <div class="arrow" style:grid-row={row} style:grid-column={column}></div>
    {/each}
  </main>
</div>

<style>
  .page {
    padding: 2rem;
  }

  main {
    min-width: 900px;
    display: grid;
    grid-gap: 1.5rem;
    grid-template-areas:
      "info  info  .     rect  rect  rect"
      "info  info  wedge wedge wedge wedge"
      "stair stair stair stack stack stack"
      "fork  fork  fork  fork  bar   bar"
      "diam  diam  wing  wing  wing  wing"
      "cres  cres  cres  cres  cres  ant"
      "range range range btree btree btree"
      ".     tree  tree  tree  tree  ."
      ".     other other other other .";
  }

  .info {
    grid-area: info;
    justify-self: start;
  }
  .info :global(h1) {
    font-size: 1.75rem;
    line-height: 1.125;
  }
  .info :global(p) {
    font-size: 1rem;
  }

  section {
    border: 2px grey solid;
    padding: 1.5rem 1rem;
    border-radius: 2px;
    position: relative;
  }

  h2 {
    font-size: 1.25rem;
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .arrow {
    align-self: end;
    justify-self: center;
    position: relative;
  }

  .arrow::after {
    position: absolute;
    top: -15px;
    left: -15px;
    content: "";
    border: solid grey;
    border-width: 0 2px 2px 0;
    padding: 13px;
    transform: rotate(45deg);
    background: var(--color-bg);
  }
</style>
