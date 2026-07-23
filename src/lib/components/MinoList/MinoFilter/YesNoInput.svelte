<script lang="ts">
  import type { YesNoItem } from "./common"
  import InputTitle from "./InputTitle.svelte"

  interface Props extends YesNoItem {
    value?: string
  }

  // A three-valued input that can be affirmative, negative, or undefined
  let {
    display,
    name,
    value = $bindable(),
    optDisplays = { yes: "yes", no: "no" },
  }: Props = $props()
</script>

<div class="container">
  <div>
    <InputTitle {display} onclear={() => (value = undefined)} />
  </div>
  {#each ["yes", "no"] as const as val}
    {@const checked = value === val}
    <label>
      <input
        type="radio"
        class="visually-hidden"
        {name}
        value={val}
        bind:group={value}
      />
      <span class:checked>{optDisplays[val]}</span>
    </label>
  {/each}
</div>

<style>
  .container {
    margin-bottom: 1rem;
  }

  label span {
    margin-right: 1rem;
    color: var(--color-fg);
    text-decoration: none;
    cursor: pointer;
  }

  label span.checked {
    color: var(--color-highlight);
    text-decoration: underline;
  }
</style>
