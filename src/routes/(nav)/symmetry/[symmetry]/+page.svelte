<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { DirClass, printSymmetry, type Symmetry } from "$lib/mino"
  import { capitalize } from "lodash-es"
  import MinoList from "../MinoList.svelte"
  import { pageTitle } from "$lib/components/theme"
  import {
    possibleClassesForSymmetry,
    possibleOnlyIfPunctured,
  } from "$lib/mino/class-symmetry"
  import ClassIcon from "$lib/components/ClassIcon.svelte"
  import { getClassColor } from "$lib/components/graph"

  const longName: Record<Symmetry, string> = {
    all: "Full symmetry",
    axis2: "Reflective symmetry (2 axes)",
    diag2: "Diagonal symmetry (2 diagonals)",
    rot2: "Rotational symmetry (4-fold)",
    axis: "Reflective symmetry (axis)",
    diag: "Reflective symmetry (diagonal)",
    rot: "Rotational symmetry (2-fold)",
    none: "Asymmetry",
  }

  const { data } = $props()
  const Content = $derived(data.content)
  const symmetry = $derived(data.symmetry)
</script>

<svelte:head>
  <title>{pageTitle(longName[symmetry])}</title>
</svelte:head>

<Breadcrumbs
  paths={[
    ["Symmetry", "/symmetry"],
    [capitalize(printSymmetry(symmetry)), `/symmetry/${symmetry}`],
  ]}
/>
<h1>
  {longName[symmetry]}
</h1>
<Content />
<h2>Classes</h2>
<div class="class-list">
  {#each possibleClassesForSymmetry(symmetry) as dirClass}
    <a href="/classes/{dirClass.name()}" title={dirClass.name()}>
      <ClassIcon
        class={dirClass}
        size={24}
        fill="none"
        stroke={getClassColor(dirClass.name())}
      />
      {#if possibleOnlyIfPunctured(dirClass, symmetry)}
        <span title="punctured only">*</span>
      {/if}
    </a>
  {/each}
</div>

<h2>Polyomino list</h2>
<MinoList {symmetry} />

<style>
  h1 {
    margin: 0;
  }

  .class-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
  }

  .class-list a {
    display: flex;
    text-decoration: none;
    gap: 0.25rem;
  }
</style>
