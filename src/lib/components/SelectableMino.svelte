<script lang="ts">
  import type { Polyomino } from "$lib/mino"
  import type Vector from "$lib/vector"
  import MinoSvg from "./MinoSvg.svelte"
  import onClickOnly from "./onClickOnly"
  import { center, onHover } from "./svgUtils"
  import { colors } from "./theme"

  interface Props {
    mino: Polyomino
    coord: Vector
    size: number
    fill: string
    stroke: string
    anchor?: string
    selected?: boolean
    onselect(mino: Polyomino): void
    onhover?(mino?: Polyomino): void
  }

  const {
    mino,
    coord,
    size,
    fill,
    stroke,
    anchor,
    selected = false,
    onselect,
    onhover,
  }: Props = $props()

  let hovered = $state(false)
  const n = $derived(mino.order)
</script>

<g>
  <MinoSvg
    {mino}
    {coord}
    size={size * (hovered ? 1.25 : 1)}
    {fill}
    {anchor}
    stroke={selected ? colors.highlight : stroke}
  />
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
  circle {
    opacity: 0;
    cursor: pointer;
    pointer-events: initial;
  }
</style>
