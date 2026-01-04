<script lang="ts">
  import type { Snippet } from "svelte"
  import { getBaseSVGProps, type SVGProps } from "./util"

  interface Props extends SVGProps<SVGElement> {
    children: Snippet
  }

  const { children, ...props }: Props = $props()
</script>

<g {...getBaseSVGProps(props)}>
  {@render children()}
</g>
