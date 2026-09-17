<script lang="ts">
  import ClassIcon from "$lib/components/classes/ClassIcon.svelte"
  import { getClassColor } from "$lib/components/graph"
  import { DirClass } from "$lib/mino"
  import InputTitle from "./InputTitle.svelte"
  import Tooltip from "./Tooltip.svelte"

  let { value = $bindable([]) } = $props()
  const outlineColor = "#999"
</script>

<div>
  <InputTitle display="Classes" onclear={() => (value = [])} />
  <div class="grid">
    {#each DirClass.all() as cls}
      {@const checked = value.includes(cls)}
      <Tooltip>
        {#snippet trigger({ props })}
          <label {...props} style:grid-area={cls.code()}>
            <!-- TODO (a11y) tab navigation -->
            <!-- TODO should I use Bits toggle group instead? -->
            <input
              type="checkbox"
              class="visually-hidden"
              bind:group={value}
              value={cls}
            />
            <ClassIcon
              class={cls}
              fill={checked ? getClassColor(cls.name()) : "none"}
              stroke={outlineColor}
              size={30}
            />
          </label>
        {/snippet}
        {cls.name()}
      </Tooltip>
    {/each}
  </div>
</div>

<style>
  .grid {
    margin-top: 0.5rem;
    display: grid;
    grid-gap: 1rem 0.75rem;
    align-items: center;
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
    justify-items: center;
  }

  label {
    cursor: pointer;
  }
</style>
