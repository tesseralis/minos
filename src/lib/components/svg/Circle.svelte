<script lang="ts">
  import Vector from "$lib/vector"
  import { getBaseSVGProps, type Point, type SVGProps } from "./util"

  interface Props extends Omit<SVGProps<SVGCircleElement>, "cx" | "cy"> {
    center?: Point
  }

  const { center = Vector.ZERO, ...svgProps }: Props = $props()
  const [cx, cy] = $derived(center)
</script>

<circle {...getBaseSVGProps(svgProps)} {cx} {cy} />
