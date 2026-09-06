<script lang="ts">
  import { endpoints } from "$lib/components/svgUtils"
  import type { DirClass } from "$lib/mino"
  import { path, type Path } from "d3-path"
  import { getDirColor } from "./helpers"
  import { TAU } from "$lib/math"

  interface Props {
    dirClass: DirClass
  }

  const dirs = ["ru", "lu", "ld", "rd"] as const
  const { dirClass }: Props = $props()
  const diagramData = $derived(dirClass.stateDiagram())

  const nodeOffset = 75
  const nodeRadius = 15

  const repeatAngle = Math.PI / 8
  const repeatLong = nodeRadius * Math.cos(repeatAngle)
  const repeatShort = nodeRadius * Math.sin(repeatAngle)

  function getPath(fn: (p: Path) => Path) {
    return fn(path()).toString()
  }
</script>

<svg viewBox="-125 -125 250 250">
  <defs>
    <!-- A marker to be used as an arrowhead -->
    <marker
      id="arrow"
      viewBox="0 -5 10 10"
      refX="10"
      refY="0"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 -4 L 10 0 L 0 4 z" stroke="context-stroke" />
    </marker>
  </defs>
  <!-- `ru` -> `ld` -->
  <line
    {...endpoints([0, nodeOffset - nodeRadius], [0, -nodeOffset + nodeRadius])}
  />
  {#if diagramData.lu_rd}
    <line
      {...endpoints(
        [-nodeOffset + nodeRadius, 0],
        [nodeOffset - nodeRadius, 0],
      )}
    />
  {/if}
  {#each dirs as dir, i}
    <g transform="rotate({i * -90})">
      <!-- Arrow to the next node -->
      <!-- Only render the arrows to/from the `lu` and `rd` nodes if they're actually in the diagram -->
      {#if (i < 2 && diagramData.lu) || (i == 2 && diagramData.rd)}
        <path
          class={{
            backward: diagramData.backward?.includes(dir),
          }}
          d={getPath((p) => {
            p.moveTo(nodeRadius, nodeOffset)
            p.arcTo(
              nodeOffset,
              nodeOffset,
              nodeOffset,
              nodeRadius,
              nodeOffset - nodeRadius,
            )
            return p
          })}
        />
      {/if}
      <!-- Arrow from a node to itself -->
      {#if diagramData.repeats?.includes(dir)}
        <path
          transform="translate(0, {nodeOffset})"
          d={getPath((p) => {
            p.moveTo(-repeatShort, repeatLong)
            p.bezierCurveTo(
              -repeatShort * 4,
              repeatLong * 3.25,
              repeatShort * 4,
              repeatLong * 3.25,
              repeatShort,
              repeatLong,
            )
            return p
          })}
        />
      {/if}
    </g>
  {/each}
  <!-- "State machine start" arrow -->
  <line {...endpoints([-nodeOffset, nodeOffset], [-nodeRadius, nodeOffset])} />
  <!-- Nodes -->
  {#each dirs as dir, i}
    {@const color = getDirColor(dir)}
    {#if i % 2 === 0 || (diagramData.lu && dir === "lu") || (diagramData.rd && dir === "rd")}
      <g
        transform="translate({nodeOffset *
          Math.sin((i / 4) * TAU)}, {nodeOffset * Math.cos((i / 4) * TAU)})"
      >
        <circle r={nodeRadius} stroke={color} />
        {#if i >= 2}
          <circle r={nodeRadius * 0.75} stroke={color} />
        {/if}
        <text fill={color}>{dir}</text>
      </g>
    {/if}
  {/each}
</svg>

<style>
  svg {
    width: 250px;
  }

  marker path {
    fill: var(--color-fg);
  }

  circle {
    fill: none;
  }

  line,
  path {
    fill: none;
    stroke: var(--color-fg);
    stroke-width: 1.5;
    marker-end: url(#arrow);
  }

  circle {
    stroke-width: 1.5;
  }

  text {
    font-family: monospace;
    font-weight: bold;
    text-anchor: middle;
    dominant-baseline: central;
  }

  .backward {
    marker-start: url(#arrow);
  }
</style>
