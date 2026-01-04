<script lang="ts">
  import Vector from "$lib/vector"
  import { getBaseSVGProps, type Point, type SVGProps } from "./util"

  interface Props extends Omit<SVGProps<SVGTextElement>, "x" | "y"> {
    coord?: Point
  }

  const { coord = Vector.ZERO, children, ...svgProps }: Props = $props()
  const [x, y] = $derived(coord)
</script>

<text {...getBaseSVGProps(svgProps)} {x} {y}>{@render children?.()}</text>
