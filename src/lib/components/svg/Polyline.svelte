<script lang="ts">
  import { type Point, type SVGProps, getBaseSVGProps } from "./util"

  interface Props extends Omit<SVGProps<SVGPolylineElement>, "points"> {
    points: readonly Point[]
  }

  const { points, ...svgProps }: Props = $props()
</script>

<polyline
  {...getBaseSVGProps(svgProps)}
  points={points.map(([x, y]) => `${x},${y}`).join(" ")}
/>
