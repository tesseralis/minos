<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { capitalize } from "lodash-es"
  import { DirClass } from "$lib/mino"
  import ClassList from "../ClassList.svelte"
  import type { PageProps } from "./$types"
  import ClassSymbol from "../ClassSymbol.svelte"
  import ClassRegex from "$lib/components/classes/ClassRegex.svelte"
  import StateDiagram from "$lib/components/classes/StateDiagram.svelte"
  import { pageTitle } from "$lib/components/theme"
  import {
    possibleOnlyIfPunctured,
    possibleSymmetriesForClass,
  } from "$lib/mino/class-symmetry"
  import SymmetryIcon from "$lib/components/SymmetryIcon.svelte"
  import { getSymmetryColor } from "$lib/components/graph"

  const { data }: PageProps = $props()
  const Content = $derived(data.content)
  const className = $derived(data.dirClass)
  const dirClass = $derived(DirClass.fromName(className))
</script>

<svelte:head>
  <title>{pageTitle(`${capitalize(className)} polyomino`)}</title>
</svelte:head>

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
      <div class="class-data">
        <div>
          <h2>Symbol</h2>
          <ClassSymbol {dirClass} />
        </div>
        {#if dirClass.name() !== "other"}
          <div>
            <h2>Regex</h2>
            <ClassRegex {dirClass} />
          </div>
        {/if}
        <div>
          <h2>Symmetries</h2>
          <div class="symmetry-list">
            {#each possibleSymmetriesForClass(dirClass) as symmetry}
              <a href="/symmetry/{symmetry}" title={symmetry}>
                <SymmetryIcon
                  {symmetry}
                  fill="none"
                  stroke={getSymmetryColor(symmetry)}
                  size={28}
                />
                {#if possibleOnlyIfPunctured(dirClass, symmetry)}
                  <span title="punctured only">*</span>
                {/if}
              </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
    {#if dirClass.name() !== "other"}
      <div class="state-diagram">
        <h2>State Diagram</h2>
        <StateDiagram {dirClass} />
      </div>
    {/if}
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
      gap: 1rem;
    }
  }

  .class-data {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 2rem;
    margin-bottom: 2rem;
  }

  .class-data .symmetry-list {
    display: flex;
    gap: 1rem;
  }

  .symmetry-list a {
    display: flex;
    text-decoration: none;
    gap: 0.25rem;
  }

  .class-data h2,
  .state-diagram h2 {
    font-size: 1.125rem;
    margin: 0;
  }
</style>
