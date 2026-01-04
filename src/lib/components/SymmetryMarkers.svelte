<script lang="ts">
  import { Polyomino } from "$lib/mino"
  import { Circle, Line, type SVGProps } from "./svg"

  interface Props extends SVGProps<any> {
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
  <Line p1={[left, 0]} p2={[right, 0]} {...svgProps} />
{/snippet}

{#snippet verticalLine()}
  <Line p1={[0, top]} p2={[0, bottom]} {...svgProps} />
{/snippet}

{#snippet mainDiagLine()}
  <Line p1={[left, bottom]} p2={[right, top]} {...svgProps} />
{/snippet}

{#snippet minorDiagLine()}
  <Line p1={[left, top]} p2={[right, bottom]} {...svgProps} />
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
  <Circle
    r={radius}
    {...svgProps}
    stroke-dasharray={`${circumference / 8} ${circumference / 8}`}
    fill="none"
  />
  <Line
    {...svgProps}
    p1={[-radius, 0]}
    p2={[-radius - arrowTip / 2, -arrowTip / 2]}
    stroke-linecap="round"
  />
  <Line
    {...svgProps}
    p1={[radius, 0]}
    p2={[radius + arrowTip / 2, arrowTip / 2]}
    stroke-linecap="round"
  />
  <Line
    {...svgProps}
    p1={[0, -radius]}
    p2={[arrowTip / 2, -radius - arrowTip / 2]}
    stroke-linecap="round"
  />
  <Line
    {...svgProps}
    p1={[0, radius]}
    p2={[-arrowTip / 2, radius + arrowTip / 2]}
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
  <Circle
    r={radius}
    {...svgProps}
    stroke-dasharray={`${circumference / 4} ${circumference / 4}`}
    fill="none"
    stroke-linecap="round"
  />
  <Line
    {...svgProps}
    p1={[-radius, 0]}
    p2={[-radius - arrowTip, -arrowTip]}
    stroke-linecap="round"
  />
  <Line
    {...svgProps}
    p1={[radius, 0]}
    p2={[radius + arrowTip, arrowTip]}
    stroke-linecap="round"
  />
{/if}
