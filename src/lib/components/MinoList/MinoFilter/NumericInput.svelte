<script lang="ts">
  import { comparators } from "./common"
  import InputTitle from "./InputTitle.svelte"

  let { display, numberAttrs = {}, value = $bindable({}) } = $props()
</script>

<InputTitle {display} onclear={() => (value = {})} />
<div class="inputs">
  <label>
    <span class="visually-hidden">{display} comparison</span>
    <select bind:value={value.comp}>
      <option value=""></option>
      {#each comparators as comp}
        <option value={comp}>{comp}</option>
      {/each}
    </select>
  </label>
  <label>
    <span class="visually-hidden">{display} value</span>
    <input type="number" bind:value={value.value} min={0} {...numberAttrs} />
  </label>
</div>

<style>
  .inputs {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    gap: 0.5rem;
  }

  select,
  input {
    background-color: var(--color-bg);
    color: var(--color-fg);
    border: 1px solid var(--color-border);
    height: 1.5rem;
    width: 100%;
  }
</style>
