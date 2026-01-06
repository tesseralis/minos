<script lang="ts">
  import { type Transform } from "$lib/mino"
  import { type Point } from "$lib/vector"
  import { getSymmetryColor } from "../graph"
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
    {@render button("↕︎", trans, [radius, 0], 45 * i)}
  {/each}
  {#each ["rotateLeft", "rotateHalf", "rotateRight"] as const as trans, i}
    {@render button(
      rotationSymbols[trans],
      trans,
      [0, -radius],
      30 * (i - 1),
      trans === "rotateHalf" ? "rotate-half" : "rotate",
    )}
  {/each}
</g>

{#snippet button(
  icon: string,
  trans: Transform,
  [x, y]: Point,
  angle: number,
  cls?: string,
)}
  <text
    class={["text", cls]}
    fill={color}
    onclick={() => (mino = mino.transform.apply(trans))}
    style:--angle="{angle}deg"
    style:--translate="{x}px, {y}px"
    {...onHover((hovered) => (context.transform = hovered ? trans : undefined))}
  >
    {icon}
  </text>
{/snippet}

<style>
  .buttons {
    transition: opacity 100ms ease-in-out;
  }

  .buttons .text {
    cursor: pointer;
    text-anchor: middle;
    pointer-events: initial;
    user-select: none;
    dominant-baseline: middle;
    transform: rotate(var(--angle)) translate(var(--translate));
  }
  .buttons .text:hover {
    fill: var(--color-highlight);
  }

  .buttons .rotate {
    font-size: 20px;
    dominant-baseline: middle;
  }
  .buttons .rotate-half {
    font-size: 20px;
    dominant-baseline: initial;
  }
</style>
