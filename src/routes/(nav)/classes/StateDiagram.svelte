<script lang="ts">
  import { endpoints } from "$lib/components/svgUtils"
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
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="8"
      markerHeight="8"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" stroke="context-stroke" />
    </marker>
  </defs>
  <g transform="translate(0, {nodeOffset})">
    <circle r={nodeRadius} />
    <circle r={nodeRadius * 0.75} />
    <text>ru</text>
  </g>
  {#if diagramData.lu}
    <g transform="translate({nodeOffset}, 0)">
      <circle r={nodeRadius} />
      <text>lu</text>
    </g>
  {/if}
  <g transform="translate(0, {-nodeOffset})">
    <circle r={nodeRadius} />
    <text>ld</text>
  </g>
  {#if diagramData.rd}
    <g transform="translate({-nodeOffset}, 0)">
      <circle r={nodeRadius} />
      <text>rd</text>
    </g>
  {/if}
  <line
    class="backward"
    {...endpoints([0, -nodeOffset + nodeRadius], [0, nodeOffset - nodeRadius])}
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
      {#if (i < 2 && diagramData.lu) || (i >= 2 && diagramData.rd)}
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
      {#if diagramData.repeats?.includes(dirs[i])}
        <path
          transform="translate(0, {nodeOffset})"
          d={getPath((p) => {
            p.moveTo(-repeatShort, repeatLong)
            p.bezierCurveTo(
              -repeatShort * 4,
              repeatLong * 3,
              repeatShort * 4,
              repeatLong * 3,
              repeatShort,
              repeatLong,
            )
            return p
          })}
        />
      {/if}
    </g>
  {/each}
</svg>

<style>
  svg {
    width: 250px;
  }

  marker path {
    fill: var(--color-fg);
  }

  circle,
  line,
  path {
    fill: none;
    stroke: var(--color-fg);
  }

  line,
  path {
    marker-end: url(#arrow);
  }

  text {
    text-anchor: middle;
    dominant-baseline: central;
  }

  .backward {
    marker-start: url(#arrow);
  }
</style>
