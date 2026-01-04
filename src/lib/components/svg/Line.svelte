<script lang="ts">
  import { type Point, type SVGProps, getBaseSVGProps } from "./util"

  interface Props extends Omit<
    SVGProps<SVGLineElement>,
    "x1" | "x2" | "y1" | "y2"
  > {
    p1: Point
    p2: Point
  }

  const { p1, p2, ...svgProps }: Props = $props()
  const [x1, y1] = $derived(p1)
  const [x2, y2] = $derived(p2)
</script>

<line {...getBaseSVGProps(svgProps)} {x1} {y1} {x2} {y2} />
