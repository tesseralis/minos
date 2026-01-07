<script lang="ts">
  import type { Polyomino, RelativeLink } from "$lib/mino"
  import Vector from "$lib/vector"
  import { scaleLinear } from "d3-scale"
  import {
    getLinkColor,
    getSortedChildren,
    getSortedParents,
    MAX_NUM_CHILDREN,
    MAX_NUM_PARENTS,
  } from "../graph"
  import SelectableMino from "../SelectableMino.svelte"
  import { colors } from "../theme"
  import { getAngleScale, getArc } from "../utils"
  import { getCompassContext } from "./helpers.svelte"
  import { linkRadius } from "./helpers.svelte"

  function getSpread(maxSpread: number, count: number) {
    return maxSpread * ((count - 1) / count)
  }

  function getBlockSize(gen: number) {
    return 25 / (gen + 4)
  }

  interface StrandProps {
    // the relative mino represented by this strand
    link: RelativeLink
    // color of the link
    linkColor: string
    // block size of the relative mino
    size: number
    // x and y coordinates of the relative mino
    coord: Vector
  }

  interface StrandsProps {
    // The set of minos to render as strands
    links: RelativeLink[]
    // The maximum number of minos that can be rendered
    maxNumMinos: number
    // The maximum and minimum amount to scale up each mino
    scaleRange: [number, number]
    // The maximum angle (in turns) that the minos can be fanned out
    maxSpread: number
    // The angle (in turns) to start the spread
    spreadStart: number
    // Whether to reverse the order of minos
    reverse?: boolean
    // Function to determine the color of the link
    linkColor(mino: Polyomino): string
  }

  let { mino = $bindable() } = $props()
  const context = $derived(getCompassContext())
</script>

<g>
  {@render strands({
    links: getSortedParents(mino),
    maxNumMinos: MAX_NUM_PARENTS,
    scaleRange: [4, 2],
    maxSpread: 1 / 3,
    spreadStart: -1 / 4,
    linkColor: (parent) => getLinkColor(parent, mino),
  })}
  {@render strands({
    links: getSortedChildren(mino),
    maxNumMinos: MAX_NUM_CHILDREN,
    scaleRange: [3, 1],
    maxSpread: 15 / 32,
    spreadStart: 1 / 4,
    reverse: true,
    linkColor: (child) => getLinkColor(mino, child),
  })}
</g>

{#snippet strands({
  links,
  maxNumMinos,
  scaleRange,
  maxSpread,
  spreadStart,
  reverse,
  linkColor,
  ...props
}: StrandsProps)}
  {@const gen = links[0]?.mino.order}
  {@const numMinos = links.length}
  {@const sizeScale = scaleLinear().domain([1, maxNumMinos]).range(scaleRange)}
  {@const scaledSize = getBlockSize(gen) * sizeScale(numMinos)}
  {@const scaledRadius = linkRadius + numMinos * 1.25}
  {@const getAngle = getAngleScale({
    spread: getSpread(maxSpread, numMinos),
    start: spreadStart,
    count: numMinos,
    reverse,
  })}
  <g>
    {#each links as link, i}
      {@const coord = Vector.fromPolar(scaledRadius, getAngle(i))}
      {@render strand({
        ...props,
        link,
        linkColor: linkColor(link.mino),
        size: scaledSize,
        coord,
      })}
    {/each}
  </g>
{/snippet}

{#snippet strand({ link, linkColor, coord, size }: StrandProps)}
  {@const hovered = context.relativeLink}
  {@const isSelected =
    !!hovered && hovered.mino.transform.equivalent(link.mino)}
  {@const linkPath = getArc(coord, Vector.ZERO, new Vector(0, -linkRadius * 2))}
  <g class:isSelected>
    <path stroke={linkColor} d={linkPath} />
    <SelectableMino
      mino={isSelected ? hovered!.mino : link.mino}
      {coord}
      {size}
      onselect={(_mino) => {
        mino = _mino
      }}
      onhover={(mino) => {
        context.relativeLink = mino ? link : undefined
      }}
    />
  </g>
{/snippet}

<style>
  path {
    stroke-width: 1;
    fill: none;
    opacity: 0.5;
  }

  .isSelected {
    --stroke: var(--color-highlight);
  }

  .isSelected path {
    stroke-width: 2;
    stroke: var(--color-highlight);
  }
</style>
