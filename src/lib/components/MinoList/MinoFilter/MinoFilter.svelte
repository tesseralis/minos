<script lang="ts">
  import MdiFilter from "virtual:icons/mdi/filter"
  import ClassInput from "./ClassInput.svelte"
  import type { FilterOptions } from "./common"
  import SymmetryInput from "./SymmetryInput.svelte"
  import YesNoInputs from "./YesNoInputs.svelte"

  interface Props {
    value: FilterOptions
  }
  const {
    value = $bindable({ symmetries: [], classes: [], yesNo: {} }),
  }: Props = $props()
  let open = $state(false)
</script>

<details bind:open>
  <summary><MdiFilter /> {open ? "Hide" : "Show"} Filters</summary>
  <form>
    <SymmetryInput bind:value={value.symmetries} />
    <ClassInput bind:value={value.classes} />
    <YesNoInputs bind:value={value.yesNo} />
  </form>
</details>

<style>
  summary {
    color: var(--color-fg);
    background: none;
    border: none;
    font-family: serif;
    font-size: 1.125rem;
    margin-top: 2rem;
    margin-left: 2rem;
    cursor: pointer;
  }
  summary:hover {
    color: var(--color-highlight);
  }

  form {
    margin: 0 4rem;
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
  }
</style>
