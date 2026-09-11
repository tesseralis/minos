<script lang="ts">
  import { max } from "lodash-es"

  interface Props {
    nodes: string[][] // list of keys
    edges: [string, string] // arrows from node to node
  }

  const { nodes, edges }: Props = $props()
  const maxCells = $derived(max(nodes.map((n) => n.length)))!
  const cellHeight = 40
  const cellWidth = 120
  const gap = 40

  function getPosition(x: number, y: number) {
    return [x * (cellWidth + gap), y * (cellHeight + gap)] as [number, number]
  }

  const indices = $derived(
    Object.fromEntries(
      nodes.flatMap((line, y) =>
        line.map((node, x) => [node, [x, y] as const]),
      ),
    ),
  )
</script>

<svg
  height={(cellHeight + gap) * nodes.length - gap}
  width={maxCells * (cellWidth + gap) - gap}
>
  {#each nodes as line, y}
    {#each line as node, x}
      <g
        transform="translate({x * (cellWidth + gap)},{y * (cellHeight + gap)})"
      >
        <rect width={cellWidth} height={cellHeight} />
        <text x={cellWidth / 2} y={cellHeight / 2}>{node}</text>
      </g>
    {/each}
  {/each}
  {#each edges as [start, end]}
    {@const startPoint = getPosition(...indices[start])}
    {@const endPoint = getPosition(...indices[end])}
    <line
      x1={startPoint[0] + cellWidth / 2}
      y1={startPoint[1] + cellHeight}
      x2={endPoint[0] + cellWidth / 2}
      y2={endPoint[1]}
    />
  {/each}
</svg>

<style>
  rect {
    fill: none;
    stroke: var(--color-fg);
  }

  text {
    text-anchor: middle;
    dominant-baseline: central;
  }

  line {
    stroke: var(--color-fg);
    stroke-width: 1;
  }
</style>
