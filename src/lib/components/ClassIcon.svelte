<script lang="ts">
  import { type Direction } from "$lib"
  import { DirClass, Polyomino } from "$lib/mino"
  import Vector from "$lib/vector"
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

  const centerOffset = $derived(
    ["bent tree", "tree"].includes(className)
      ? Vector.DOWN.scale(size / 8)
      : Vector.ZERO,
  )
</script>

<MinoDiv
  {mino}
  strokeWidth={1}
  size={size / Math.max(mino.height, mino.width)}
  gridStyle="none"
  --fill={fill}
  --stroke="hsl(from {stroke} h s l / 0.75)"
>
  {#snippet markings({ anchor: anchorFn })}
    {@const centerPoint = anchorFn("center").add(centerOffset)}
    {@const radius = size / 15}

    {#snippet directed(anchor: string = "bottom left")}
      {@const offset = size / 6}
      {@const [vert, horiz] = anchor.split(" ")}
      {@const ySign = vert === "top" ? -1 : 1}
      {@const xSign = horiz === "left" ? -1 : 1}
      {@const offsetVec = new Vector(xSign, ySign)}
      {@const anchorPoint = anchorFn(anchor)}
      <line
        {...endpoints(anchorPoint, anchorPoint.sub(offsetVec.scale(offset)))}
        {...markerProps}
      />
    {/snippet}
    {#snippet semidirected(direction: Direction)}
      {@const offset = size / 4}
      <line
        {...endpoints(
          centerPoint,
          centerPoint.add(Vector.direction(direction).scale(offset)),
        )}
        {...markerProps}
      />
    {/snippet}

    {#snippet convex()}
      {@render semidirected("up")}
      {@render semidirected("right")}
      {@render semidirected("down")}
      {@render semidirected("left")}
    {/snippet}

    {#if className !== "other"}
      <circle
        {...center(centerPoint)}
        r={radius}
        {...markerProps}
        fill={stroke}
      />
    {/if}
    {#if className === "rectangle"}
      {@render convex()}
      {@render directed("bottom left")}
      {@render directed("top left")}
      {@render directed("top right")}
      {@render directed("bottom right")}
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
      {@render semidirected("up")}
      {@render semidirected("down")}
      {@render semidirected("right")}
      {@render directed("bottom left")}
      {@render directed("top left")}
    {:else if className === "diamond"}
      {@render convex()}
    {:else if className === "wing"}
      {@render directed()}
      {@render semidirected("up")}
      {@render semidirected("down")}
      {@render semidirected("right")}
    {:else if className === "crescent"}
      {@render semidirected("up")}
      {@render semidirected("down")}
      {@render semidirected("right")}
    {:else if className === "antler"}
      {@render directed()}
      {@render semidirected("up")}
      {@render semidirected("right")}
    {:else if className === "bent tree"}
      {@render semidirected("up")}
      {@render semidirected("right")}
    {:else if className === "range chart"}
      {@render semidirected("up")}
      {@render semidirected("down")}
    {:else if className === "tree"}
      {@render semidirected("up")}
    {/if}
  {/snippet}
</MinoDiv>

<style>
  :global(svg) {
    overflow: visible;
  }
</style>
