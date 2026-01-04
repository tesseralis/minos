<!-- @component
A single mino wrapped in a div aligning with its dimensions.
 -->
<script lang="ts" module>
  import MinoSvg, { type Props as MinoSvgProps } from "./MinoSvg.svelte"
  import Vector from "$lib/vector"
  import { type Snippet } from "svelte"

  export interface Props extends Omit<MinoSvgProps, "coord" | "onClick"> {
    children?: Snippet
  }
</script>

<script lang="ts">
  const { mino, size, children, ...props }: Props = $props()

  const [width, height] = $derived(mino.dims)

  const svgWidth = $derived(width * size + 2)
  const svgHeight = $derived(height * size + 2)
</script>

<svg
  width={svgWidth}
  height={svgHeight}
  viewBox="{-svgWidth / 2} {-svgHeight / 2} {svgWidth} {svgHeight}"
>
  <MinoSvg {...props} {mino} {size} coord={Vector.ZERO} />
  {@render children?.()}
</svg>
