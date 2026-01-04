<script lang="ts">
  import type { YesNoItem, YesNoOptions } from "./common"
  import YesNoInput from "./YesNoInput.svelte"

  const yesNoItems: YesNoItem[] = [
    {
      name: "hasHole",
      display: "Holes",
      optDisplays: {
        yes: "has hole",
        no: "no holes",
      },
    },
    {
      name: "hasTiling",
      display: "Tiling",
      optDisplays: {
        yes: "has tiling",
        no: "no tiling",
      },
    },
    {
      name: "isBalanced",
      display: "Balance",
      optDisplays: {
        yes: "balanced",
        no: "unbalanced",
      },
    },
  ]

  interface Props {
    value?: YesNoOptions
  }

  const { value = $bindable<YesNoOptions>({}) }: Props = $props()
</script>

<div>
  {#each yesNoItems as item}
    <YesNoInput {...item} bind:value={value[item.name]} />
  {/each}
</div>
