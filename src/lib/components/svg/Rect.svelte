<script lang="ts">
  import Vector from "$lib/vector"
  import { getBaseSVGProps, type Point, type SVGProps } from "./util"

  interface Props extends Omit<SVGProps<SVGRectElement>, "x" | "y"> {
    coord?: Point
  }

  const { coord = Vector.ZERO, ...svgProps }: Props = $props()
  const [x, y] = $derived(coord)
</script>

<rect {...getBaseSVGProps(svgProps)} {x} {y} />
