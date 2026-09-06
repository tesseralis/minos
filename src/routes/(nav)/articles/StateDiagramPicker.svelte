<script lang="ts">
  import ClassIcon from "$lib/components/classes/ClassIcon.svelte"
  import ClassRegex from "$lib/components/classes/ClassRegex.svelte"
  import StateDiagram from "$lib/components/classes/StateDiagram.svelte"
  import { getClassColor } from "$lib/components/graph"
  import { DirClass } from "$lib/mino"
  import { capitalize } from "lodash-es"

  let dirClass = $state(DirClass.fromName("rectangle"))
</script>

<div class="picker">
  <div class="subsection-buttons">
    {#each DirClass.all() as cls}
      {@const isActive = cls == dirClass}
      <button
        class:active={isActive}
        style:grid-area={cls.code()}
        onclick={() => (dirClass = cls)}
      >
        <ClassIcon
          class={cls}
          fill="none"
          stroke={getClassColor(cls.name())}
          size={50}
        />
        {capitalize(cls.name())}
      </button>
    {/each}
  </div>
  <div>
    <StateDiagram {dirClass} />
    <ClassRegex {dirClass} />
  </div>
</div>

<style>
  .picker {
    display: grid;
    align-items: center;
    grid-template-columns: 20rem 1fr;
    gap: 2rem;
  }

  .subsection-buttons {
    display: grid;
    align-content: start;
    gap: 0.125rem 0;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-template-areas:
      ".     .     rect  ."
      ".     wedge rect  ."
      "stair wedge stack ."
      "stair fork  stack bar"
      "diam  fork  wing  bar"
      "diam  cres  wing  ant"
      "range cres  btree ant"
      "range tree  btree ."
      ".     tree  other ."
      ".     .     other .";
  }

  .subsection-buttons button {
    color: var(--color-fg);
    font-family: serif;
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.25rem;
    line-height: 1;
    text-decoration: none;

    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 150ms ease-in-out;
  }
</style>
