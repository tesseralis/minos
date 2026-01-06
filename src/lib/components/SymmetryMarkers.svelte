<script lang="ts">
  import { Polyomino } from "$lib/mino"
  import type { SVGAttributes } from "svelte/elements"
  import { endpoints } from "./svgUtils"

  interface Props extends SVGAttributes<any> {
    mino: Polyomino
    // The size to a cell of the polyomino
    size: number
  }

  const { mino, size, ...svgProps }: Props = $props()

  const [width, height] = $derived(mino.dims.map((dim) => dim * size))
  const overflow = $derived(size / 4)
  const left = $derived(-width / 2 - overflow)
  const right = $derived(width / 2 + overflow)
  const top = $derived(-height / 2 - overflow)
  const bottom = $derived(height / 2 + overflow)

  const radius = $derived(Math.min(width, height) / 2 - overflow)
  const circumference = $derived(2 * Math.PI * radius)
  const arrowTip = $derived(radius / 3)

  const symmetry = $derived(mino.transform.symmetry())
</script>

{#snippet horizontalLine()}
  <line {...endpoints([left, 0], [right, 0])} {...svgProps} />
{/snippet}

{#snippet verticalLine()}
  <line {...endpoints([0, top], [0, bottom])} {...svgProps} />
{/snippet}

{#snippet mainDiagLine()}
  <line {...endpoints([left, bottom], [right, top])} {...svgProps} />
{/snippet}

{#snippet minorDiagLine()}
  <line {...endpoints([left, top], [right, bottom])} {...svgProps} />
{/snippet}

{#if symmetry === "all"}
  {@render horizontalLine()}
  {@render verticalLine()}
  {@render mainDiagLine()}
  {@render minorDiagLine()}
{:else if symmetry === "axis2"}
  {@render horizontalLine()}
  {@render verticalLine()}
{:else if symmetry === "diag2"}
  {@render mainDiagLine()}
  {@render minorDiagLine()}
{:else if symmetry === "rot2"}
  <circle
    r={radius}
    {...svgProps}
    stroke-dasharray={`${circumference / 8} ${circumference / 8}`}
    fill="none"
  />
  <line
    {...svgProps}
    {...endpoints([-radius, 0], [-radius - arrowTip / 2, -arrowTip / 2])}
    stroke-linecap="round"
  />
  <line
    {...svgProps}
    {...endpoints([radius, 0], [radius + arrowTip / 2, arrowTip / 2])}
    stroke-linecap="round"
  />
  <line
    {...svgProps}
    {...endpoints([0, -radius], [arrowTip / 2, -radius - arrowTip / 2])}
    stroke-linecap="round"
  />
  <line
    {...svgProps}
    {...endpoints([0, radius], [-arrowTip / 2, radius + arrowTip / 2])}
    stroke-linecap="round"
  />
{:else if symmetry === "axis"}
  {#if mino.equals(mino.transform.apply("flipVert"))}
    {@render horizontalLine()}
  {:else}
    {@render verticalLine()}
  {/if}
{:else if symmetry === "diag"}
  {#if mino.equals(mino.transform.apply("flipMinorDiag"))}
    {@render mainDiagLine()}
  {:else}
    {@render minorDiagLine()}
  {/if}
{:else if symmetry === "rot"}
  <circle
    r={radius}
    {...svgProps}
    stroke-dasharray={`${circumference / 4} ${circumference / 4}`}
    fill="none"
    stroke-linecap="round"
  />
  <line
    {...svgProps}
    {...endpoints([-radius, 0], [-radius - arrowTip, -arrowTip])}
    stroke-linecap="round"
  />
  <line
    {...svgProps}
    {...endpoints([radius, 0], [radius + arrowTip, arrowTip])}
    stroke-linecap="round"
  />
{/if}
