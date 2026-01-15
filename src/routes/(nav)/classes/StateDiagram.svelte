<script lang="ts">
  import { endpoints } from "$lib/components/svgUtils"
  import { path, type Path } from "d3-path"

  const nodeOffset = 75
  const nodeRadius = 15

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
      markerWidth="6"
      markerHeight="6"
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
  <g transform="translate(0, {-nodeOffset})">
    <circle r={nodeRadius} />
    <text>ld</text>
  </g>
  <g transform="translate({nodeOffset}, 0)">
    <circle r={nodeRadius} />
    <text>lu</text>
  </g>
  <g transform="translate({-nodeOffset}, 0)">
    <circle r={nodeRadius} />
    <text>rd</text>
  </g>
  <line
    class="forward backward"
    {...endpoints([0, -nodeOffset + nodeRadius], [0, nodeOffset - nodeRadius])}
  />
  <path
    class="forward"
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
  <path
    class="forward"
    d={getPath((p) => {
      p.moveTo(nodeOffset, -nodeRadius)
      p.arcTo(
        nodeOffset,
        -nodeOffset,
        nodeRadius,
        -nodeOffset,
        nodeOffset - nodeRadius,
      )
      return p
    })}
  />
  <path
    class="forward"
    d={getPath((p) => {
      p.moveTo(-nodeRadius, -nodeOffset)
      p.arcTo(
        -nodeOffset,
        -nodeOffset,
        -nodeOffset,
        -nodeRadius,
        nodeOffset - nodeRadius,
      )
      return p
    })}
  />
  <path
    class="forward"
    d={getPath((p) => {
      p.moveTo(-nodeOffset, nodeRadius)
      p.arcTo(
        -nodeOffset,
        nodeOffset,
        -nodeRadius,
        nodeOffset,
        nodeOffset - nodeRadius,
      )
      return p
    })}
  />
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

  text {
    text-anchor: middle;
    dominant-baseline: central;
  }

  .forward {
    marker-end: url(#arrow);
  }

  .backward {
    marker-start: url(#arrow);
  }
</style>
