<script lang="ts">
  import { numericOpts, type NumericOptions } from "./common"
  import NumericInput from "./NumericInput.svelte"

  interface Props {
    value?: NumericOptions
  }

  const { value = $bindable({}) }: Props = $props()
</script>

<div>
  {#each numericOpts as item}
    <NumericInput {...item} bind:value={value[item.name]} />
  {/each}
</div>
