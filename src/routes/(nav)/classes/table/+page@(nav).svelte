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
  import panzoom from "panzoom"
  import StateDiagram from "../StateDiagram.svelte"

  const rows = [
    ["rectangle"],
    ["wedge"],
    ["staircase", "stack"],
    ["fork", "bar chart"],
    ["diamond", "wing"],
    ["crescent", "antler"],
    ["range chart", "bent tree"],
    ["tree"],
    ["other"],
  ]

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

<div
  class="page"
  {@attach (el: HTMLDivElement) => {
    const instance = panzoom(el, {
      zoomSpeed: 0.075,
    })
    return () => {
      instance.dispose()
    }
  }}
>
  <Breadcrumbs
    paths={[
      ["Classes", "/classes"],
      ["Table", "/classes/table"],
    ]}
  />
  <main>
    {#each rows as row}
      <div class="row">
        {#each row as clsName}
          {@const dirClass = DirClass.fromName(clsName)}
          <section class={clsName.replace(" ", "-")}>
            <div>
              <h2>
                <a href="/classes/{escapeClass(dirClass.name())}">
                  {capitalize(dirClass.name())}
                </a>
                <ClassSymbol {dirClass} />
              </h2>
              <ClassRegex {dirClass} />
              <StateDiagram {dirClass} />
            </div>
            <div class="class-list">
              <ClassList {dirClass} />
            </div>
          </section>
        {/each}
      </div>
    {/each}
  </main>
</div>

<style>
  .page {
    padding: 2rem;
    width: 3000px;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
  }

  .row {
    display: flex;
    gap: 2rem;
  }

  .row:nth-child(3) {
    translate: -12.5% 0;
  }

  .row:nth-child(5) {
    translate: 25% 0;
  }

  /* main {
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
  } */

  /* .info {
    grid-area: info;
    justify-self: start;
  }
  .info :global(h1) {
    font-size: 1.75rem;
    line-height: 1.125;
  }
  .info :global(p) {
    font-size: 1rem;
  } */

  section {
    border: 2px grey solid;
    padding: 1.5rem 1rem;
    border-radius: 2px;
    position: relative;
    display: flex;
    gap: 2rem;
  }

  section:nth-child(odd) {
    flex-direction: row-reverse;
  }

  h2 {
    font-size: 1.25rem;
    margin: 0;
    margin-bottom: 0.5rem;
  }

  section.rectangle .class-list {
    width: 350px;
  }

  section.wedge .class-list {
    width: 600px;
  }

  section.staircase .class-list {
    width: 1200px;
  }

  section.stack .class-list {
    width: 575px;
  }

  section.antler .class-list {
    width: 300px;
  }

  section.range-chart .class-list {
    width: 500px;
  }

  section.bent-tree .class-list {
    width: 200px;
  }

  section.tree .class-list {
    width: 200px;
  }

  section.other .class-list {
    width: 500px;
  }

  /* .arrow {
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
  } */
</style>
