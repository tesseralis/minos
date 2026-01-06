<script lang="ts">
  import { type Transform } from "$lib/mino"
  import { getSymmetryColor } from "../graph"
  import { svgTransform, SVGTransform } from "../svgUtils"
  import { onHover } from "../svgUtils"
  import { getCompassContext, innerRingRadius } from "./helpers.svelte"
  import { reflectionOrder } from "./ReflectionAxes.svelte"

  const radius = innerRingRadius + 7.5

  // TODO replace these icons with actual SVG
  const rotationSymbols = {
    rotateRight: "⃕",
    rotateHalf: "↻",
    rotateLeft: "⃔",
  }

  let { visible, mino = $bindable() } = $props()
  const context = $derived(getCompassContext())
  const color = $derived(getSymmetryColor(mino.transform.symmetry()))
</script>

<g class="buttons" opacity={visible ? 1 : 0}>
  {#each reflectionOrder as trans, i}
    {@render button(
      "↕︎",
      trans,
      svgTransform()
        .translate(radius, 0)
        .rotate(45 * i),
    )}
  {/each}
  {#each ["rotateLeft", "rotateHalf", "rotateRight"] as const as trans, i}
    {@render button(
      rotationSymbols[trans],
      trans,
      svgTransform()
        .translate(0, -radius)
        .rotate(30 * (i - 1)),
      trans === "rotateHalf" ? "rotate-half" : "rotate",
    )}
  {/each}
</g>

{#snippet button(
  icon: string,
  trans: Transform,
  svgTrans: SVGTransform,
  cls?: string,
)}
  <text
    class={["text", cls]}
    fill={color}
    onclick={() => (mino = mino.transform.apply(trans))}
    {...onHover((hovered) => (context.transform = hovered ? trans : undefined))}
    transform={svgTrans.toString()}
  >
    {icon}
  </text>
{/snippet}

<style>
  .buttons {
    transition: opacity 100ms ease-in-out;
  }

  .buttons :global(.text) {
    cursor: pointer;
    text-anchor: middle;
    pointer-events: initial;
    user-select: none;
    dominant-baseline: middle;
  }
  .buttons :global(.text):hover {
    fill: var(--color-highlight);
  }

  .buttons :global(.rotate) {
    font-size: 20px;
    dominant-baseline: middle;
  }
  .buttons :global(.rotate-half) {
    font-size: 20px;
    dominant-baseline: initial;
  }
</style>
