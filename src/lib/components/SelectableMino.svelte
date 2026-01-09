<script lang="ts">
  import type { Polyomino } from "$lib/mino"
  import type Vector from "$lib/vector"
  import MinoSvg from "./MinoSvg.svelte"
  import onClickOnly from "./onClickOnly"
  import { center, onHover } from "./svgUtils"

  interface Props {
    mino: Polyomino
    coord: Vector
    size: number
    anchor?: string
    selected?: boolean
    onselect(mino: Polyomino): void
    onhover?(mino?: Polyomino): void
  }

  const {
    mino,
    coord,
    size,
    anchor,
    selected = false,
    onselect,
    onhover,
  }: Props = $props()

  let hovered = $state(false)
  const n = $derived(mino.order)
</script>

<g class:selected>
  <MinoSvg {mino} {coord} size={size * (hovered ? 1.25 : 1)} {anchor} />
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <circle
    tabindex={0}
    {...center(coord)}
    r={(n * size) / 2}
    {@attach onClickOnly(() => {
      onselect?.(mino)
    })}
    {...onHover((value) => {
      hovered = value
      onhover?.(value ? mino : undefined)
    })}
  />
</g>

<style>
  g.selected {
    --stroke: var(--color-highlight);
  }

  circle {
    opacity: 0;
    cursor: pointer;
    pointer-events: initial;
  }
</style>
