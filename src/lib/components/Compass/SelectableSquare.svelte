<script lang="ts">
  import type { Polyomino, PossibleRelativeLink } from "$lib/mino"
  import { onHover, point } from "../svgUtils"
  import { getCompassContext, getMinoSizeAndTransform } from "./helpers.svelte"

  interface Props {
    link: PossibleRelativeLink
    selected: Polyomino
  }

  let { link, selected = $bindable() }: Props = $props()
  const { mino, coord } = $derived(link)
  const context = $derived(getCompassContext())
  const relative = $derived(context.relativeLink)
  const { size, transform } = $derived(getMinoSizeAndTransform(selected))
  const isSelected = $derived(relative?.coord.equals(coord))
</script>

<g>
  <rect
    data-selectable={!!mino}
    data-selected={isSelected}
    class={[!!mino && "selectable"]}
    {...point(transform(coord))}
    width={size}
    height={size}
    stroke-width={(size / 8) * 0.75}
    onclick={() => {
      if (mino) {
        selected = mino
      }
    }}
    {...onHover((hovered) => {
      if (mino) {
        context.relativeLink = hovered ? (link as any) : undefined
      }
    })}
  />
</g>

<style>
  g rect[data-selectable="true"] {
    transition: all 150ms ease-in-out;
    transition-property: fill, opacity;
    cursor: pointer;
    pointer-events: initial;
  }
</style>
