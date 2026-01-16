<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { capitalize } from "lodash-es"
  import { DirClass } from "$lib/mino"
  import ClassRegex from "../ClassRegex.svelte"
  import ClassList from "../ClassList.svelte"
  import type { PageProps } from "./$types"
  import ClassSymbol from "../ClassSymbol.svelte"
  import StateDiagram from "../StateDiagram.svelte"

  const { data }: PageProps = $props()
  const Content = $derived(data.content)
  const className = $derived(data.dirClass)
  const dirClass = $derived(DirClass.fromName(className))
</script>

<div class="container">
  <Breadcrumbs
    paths={[
      ["Classes", "/classes"],
      [capitalize(className), `/classes/${className}`],
    ]}
  />
  <div class="main">
    <div>
      <h1>{capitalize(className)} polyomino</h1>
      <Content />
    </div>
    <div class="class-data">
      <div>
        <h2>Symbol</h2>
        <ClassSymbol {dirClass} />
      </div>
      <div>
        <h2>Regex</h2>
        {#if dirClass.regex()}
          <ClassRegex {dirClass} />
        {:else}
          --
        {/if}
      </div>
      <div>
        <h2>State Diagram</h2>
        <StateDiagram {dirClass} />
      </div>
    </div>
  </div>
  <h2>Polyomino list</h2>
  <ClassList {dirClass} />
</div>

<style>
  .container {
    container-type: inline-size;
  }

  h1 {
    margin: 0;
  }

  .main {
    display: grid;
    gap: 4rem;
    grid-template-columns: 1fr 20rem;
  }

  @container (width < 40rem) {
    .main {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
  }

  .class-data {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .class-data h2 {
    font-size: 1.125rem;
    margin: 0;
  }
</style>
