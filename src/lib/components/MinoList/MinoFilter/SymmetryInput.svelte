<script lang="ts">
  import { getSymmetryColor } from "$lib/components/graph"
  import SymmetryIcon from "$lib/components/SymmetryIcon.svelte"
  import { printSymmetry, symmetries } from "$lib/mino"
  import InputTitle from "./InputTitle.svelte"
  import Tooltip from "./Tooltip.svelte"

  let { value = $bindable([]) } = $props()
  const outlineColor = "#999"
</script>

<div>
  <InputTitle display="Symmetries" onclear={() => (value = [])} />
  <div class="grid">
    {#each symmetries as sym}
      {@const checked = value.includes(sym)}
      <Tooltip>
        {#snippet trigger({ props })}
          <label {...props} style:grid-area={sym}>
            <!-- TODO (a11y) tab navigation -->
            <input
              type="checkbox"
              class="visually-hidden"
              bind:group={value}
              value={sym}
            />
            <SymmetryIcon
              symmetry={sym}
              fill={checked ? getSymmetryColor(sym) : "none"}
              stroke={outlineColor}
              size={30}
            />
          </label>
        {/snippet}
        {printSymmetry(sym)}
      </Tooltip>
    {/each}
  </div>
</div>

<style>
  .grid {
    margin-top: 0.5rem;
    display: grid;
    grid-gap: 0.5rem 1rem;
    grid-template-areas:
      ".     all  ."
      "axis2 rot2 diag2"
      "axis  rot  diag"
      ".     none .";
  }

  label {
    cursor: pointer;
  }
</style>
