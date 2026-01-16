<script lang="ts">
  import { endpoints } from "$lib/components/svgUtils"
  import { colors } from "$lib/components/theme"
  import type { DirClass } from "$lib/mino"
  import { path, type Path } from "d3-path"
  import { range } from "lodash-es"

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
  <line
    {...endpoints([0, nodeOffset - nodeRadius], [0, -nodeOffset + nodeRadius])}
  />
  {#if diagramData.lu_rd}
    <line
      class="backward"
      {...endpoints(
        [-nodeOffset + nodeRadius, 0],
        [nodeOffset - nodeRadius, 0],
      )}
    />
  {/if}
  {#each range(4) as i}
    <g transform="rotate({i * -90})">
      {#if (i < 2 && diagramData.lu) || (i == 2 && diagramData.rd)}
        <path
          class={{
            backward: diagramData.backward?.includes(dirs[i]),
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
      <!-- Repeat arrow -->
      {#if diagramData.repeats?.includes(dirs[i])}
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
  <line {...endpoints([-nodeOffset, nodeOffset], [-nodeRadius, nodeOffset])} />
  <g transform="translate(0, {nodeOffset})">
    <circle r={nodeRadius} stroke={colors.palette[1]} />
    <text fill={colors.palette[1]}>ru</text>
  </g>
  {#if diagramData.lu}
    <g transform="translate({nodeOffset}, 0)">
      <circle r={nodeRadius} stroke={colors.palette[2]} />
      <text fill={colors.palette[2]}>lu</text>
    </g>
  {/if}
  <g transform="translate(0, {-nodeOffset})">
    <circle r={nodeRadius} stroke={colors.palette[3]} />
    <circle r={nodeRadius * 0.75} stroke={colors.palette[3]} />
    <text fill={colors.palette[3]}>ld</text>
  </g>
  {#if diagramData.rd}
    <g transform="translate({-nodeOffset}, 0)">
      <circle r={nodeRadius} stroke={colors.palette[0]} />
      <circle r={nodeRadius * 0.75} stroke={colors.palette[0]} />
      <text fill={colors.palette[0]}>rd</text>
    </g>
  {/if}
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
