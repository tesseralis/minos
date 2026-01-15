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

<div>
  <Breadcrumbs
    paths={[
      ["Classes", "/classes"],
      [capitalize(className), `/classes/${className}`],
    ]}
  />
  <h1>{capitalize(className)} polyomino</h1>
  <Content />
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
      <StateDiagram />
    </div>
  </div>
  <h2>Polyomino list</h2>
  <ClassList {dirClass} />
</div>

<style>
  h1 {
    margin: 0;
  }

  .class-data {
    display: flex;
    gap: 2rem;
  }

  .class-data h2 {
    font-size: 1.125rem;
    margin: 0;
  }
</style>
