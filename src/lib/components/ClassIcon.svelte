<script lang="ts">
  import { DirClass, Polyomino } from "$lib/mino"
  import MinoDiv from "./MinoDiv.svelte"
  import { center, endpoints } from "./svgUtils"

  interface Props {
    class: DirClass
    size: number
    fill: string
    stroke: string
  }

  const reprMinos: Record<string, string> = {
    rectangle: "111_111",
    wedge: "111_110_100",
    staircase: "011_110_100",
    stack: "111_110_010",
    fork: "011_110_010",
    "bar chart": "111_101_100",
    diamond: "010_111_010",
    wing: "001_111_101",
    crescent: "010_111_101",
    antler: "111_101_011",
    "bent tree": "1100_0111_1101",
    "range chart": "101_111_101",
    tree: "1101_0111_1101",
    other: "11011_01110_11011",
  }

  const { class: cls, size, fill, stroke }: Props = $props()
  const className = $derived(cls.name())
  const mino = $derived(Polyomino.of(reprMinos[className]))
  const markerProps = $derived({
    stroke,
    strokeWidth: size / 24,
    fill: "none",
  })
</script>

<MinoDiv
  {mino}
  strokeWidth={1}
  size={size / Math.max(mino.height, mino.width)}
  gridStyle="none"
  --fill={fill}
  --stroke="hsl(from {stroke} h s l / 0.75)"
>
  {#if className === "rectangle"}
    {@render convex()}
    {@render directed("bottom left", { x: size / 3 })}
    {@render directed("top left", { x: size / 3 })}
    {@render directed("top right", { x: size / 3 })}
    {@render directed("bottom right", { x: size / 3 })}
  {:else if className === "wedge"}
    {@render convex()}
    {@render directed("bottom left")}
    {@render directed("top left")}
    {@render directed("top right")}
  {:else if className === "staircase"}
    {@render convex()}
    {@render directed("bottom left")}
    {@render directed("top right")}
  {:else if className === "stack"}
    {@render convex()}
    {@render directed("bottom left")}
    {@render directed("top left")}
  {:else if className === "fork"}
    {@render convex()}
    {@render directed()}
  {:else if className === "bar chart"}
    {@render semidirected("bottom")}
    {@render semidirected("top")}
    {@render semidirected("left")}
    {@render directed("bottom left")}
    {@render directed("top left")}
  {:else if className === "diamond"}
    {@render convex()}
  {:else if className === "wing"}
    {@render directed()}
    {@render semidirected("bottom")}
    {@render semidirected("top")}
    {@render semidirected("left")}
  {:else if className === "crescent"}
    {@render semidirected("bottom")}
    {@render semidirected("top")}
    {@render semidirected("left")}
  {:else if className === "antler"}
    {@render directed()}
    {@render semidirected("bottom")}
    {@render semidirected("left")}
  {:else if className === "bent tree"}
    {@render semidirected("bottom", { yOffset: size / 8 })}
    {@render semidirected("left", { yOffset: size / 8 })}
  {:else if className === "range chart"}
    {@render semidirected("bottom")}
    {@render semidirected("top")}
  {:else if className === "tree"}
    {@render semidirected("bottom", { yOffset: size / 8 })}
  {/if}
</MinoDiv>

{#snippet directed(
  anchor: string = "bottom left",
  {
    x = size / 2,
    y = size / 2,
  }: {
    x?: number
    y?: number
  } = {},
)}
  {@const offset = size / 6}
  {@const [vert, horiz] = anchor.split(" ")}
  {@const ySign = vert === "top" ? -1 : 1}
  {@const xSign = horiz === "left" ? -1 : 1}
  <line
    {...endpoints(
      [xSign * x, ySign * y],
      [xSign * (x - offset), ySign * (y - offset)],
    )}
    {...markerProps}
  />
{/snippet}

{#snippet convex()}
  {@render semidirected("bottom")}
  {@render semidirected("left")}
  {@render semidirected("right")}
  {@render semidirected("top")}
{/snippet}

{#snippet semidirected(
  anchor: string = "bottom",
  {
    xOffset = 0,
    yOffset = 0,
  }: {
    xOffset?: number
    yOffset?: number
  } = {},
)}
  {@const offset = size / 4}
  {#if anchor === "top" || anchor === "bottom"}
    {@const ySign = anchor === "top" ? 1 : -1}
    {@const radius = size / 15}
    <circle
      {...center([xOffset, yOffset])}
      r={radius}
      {...markerProps}
      fill={stroke}
    />
    <line
      {...endpoints([xOffset, yOffset], [xOffset, yOffset + ySign * offset])}
      {...markerProps}
    />
  {:else}
    {@const xSign = anchor === "left" ? 1 : -1}
    <circle
      {...center([xOffset, yOffset])}
      r={1}
      {...markerProps}
      fill={stroke}
    />
    <line
      {...endpoints([xOffset, yOffset], [xOffset + xSign * offset, yOffset])}
      {...markerProps}
    />
  {/if}
{/snippet}
