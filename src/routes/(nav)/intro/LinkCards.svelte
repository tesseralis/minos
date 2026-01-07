<script lang="ts">
  import ClassIcon from "$lib/components/ClassIcon.svelte"
  import { getClassColor, getSymmetryColor, nodes } from "$lib/components/graph"
  import MinoDiv from "$lib/components/MinoDiv.svelte"
  import SymmetryMarkers from "$lib/components/SymmetryMarkers.svelte"
  import { colors } from "$lib/components/theme"
  import { DirClass, Polyomino } from "$lib/mino"
  import tinycolor from "tinycolor2"
  import Pattern from "$lib/components/Pattern.svelte"
  import Tiling from "$lib/components/Tiling.svelte"
  import Vector from "$lib/vector"
  import MinoSvg from "$lib/components/MinoSvg.svelte"
  import { capitalize } from "lodash-es"
  import { endpoints } from "$lib/components/svgUtils"
  const cards = [
    {
      name: "catalog",
      description:
        "A list of polyominoes up to octominoes with a summary of their properties.",
      thumbnail: catalogThumbnail,
    },
    {
      name: "symmetry",
      description:
        "An explanation of the different types of symmetries a polyomino can have.",
      thumbnail: symmetryThumbnail,
    },
    {
      name: "classes",
      description:
        'A hierarchial categorization of polyominoes based on "directedness".',
      thumbnail: classThumbnail,
    },
    {
      name: "packing",
      description: "Fitting a set of polyominoes tightly in some container.",
      thumbnail: patternThumbnail,
    },
    {
      name: "tiling",
      description: "Whether a single polyomino can completely fill the plane.",
      thumbnail: tilingThumbnail,
    },
    {
      name: "genealogy",
      description:
        'A "family tree" showing how polyominoes are built from simpler polyominoes.',
      thumbnail: genealogyThumbnail,
    },
  ]
</script>

<div class="cards">
  {#each cards as { name, description, thumbnail }}
    <a href="/{name}">
      <div class="thumbnail-wrapper">
        {@render thumbnail()}
      </div>
      <div class="text">
        <div style:color={colors.heading}>
          {capitalize(name)}
        </div>
        <div>{description}</div>
      </div>
    </a>
  {/each}
</div>

{#snippet catalogThumbnail()}
  {@const pentominoes = nodes[5 - 1]}
  <div class="catalog">
    {#each pentominoes as mino}
      <MinoDiv {mino} size={10} fill="none" stroke="currentcolor" />
    {/each}
  </div>
{/snippet}

{#snippet symmetryThumbnail()}
  {@const minos = [
    ["none", "0010_1111_0110_0100"],
    ["axis", "111_111_101"],
    ["diag", "111_111_011"],
    ["rot", "100_111_111_001"],
    ["all", "111_101_111"],
    ["axis2", "010_111_111_010"],
    ["diag2", "0100_1110_0111_0010"],
    ["rot2", "0100_0111_1110_0010"],
  ] as const}
  <div class="symmetry">
    {#each minos as [symmetry, minoStr]}
      {@const mino = Polyomino.of(minoStr)}
      {@const color = tinycolor(getSymmetryColor(symmetry))
        .desaturate(40)
        .toHexString()}
      {@const size = 12}
      <MinoDiv {mino} stroke="black" fill={color} {size}>
        <SymmetryMarkers {mino} {size} stroke="white" stroke-width={2} />
      </MinoDiv>
    {/each}
  </div>
{/snippet}

{#snippet classThumbnail()}
  <div class="class">
    {#each DirClass.all() as cls}
      <ClassIcon
        class={cls}
        size={28}
        fill="none"
        stroke={getClassColor(cls.name())}
      />
    {/each}
  </div>
{/snippet}

{#snippet patternThumbnail()}
  {@const pattern = `🟥🟩🟩🟧🟧🟧🟧🟨🟨🟨
🟥🟩🟩🟪🟧🟦🟦🟦🟦🟨
🟥🟩🟪🟪🟪🟥🟨🟨🟦🟨
🟥🟦🟧🟪🟥🟥🟥🟨🟪🟪
🟥🟦🟧🟧🟩🟩🟥🟨🟨🟪
🟦🟦🟦🟧🟧🟩🟩🟩🟪🟪`}
  <div class="pattern">
    <Pattern {pattern} />
  </div>
{/snippet}

{#snippet tilingThumbnail()}
  <Tiling mino={Polyomino.of("00011_10110_11100")} gridSize={12} />
{/snippet}

{#snippet genealogyThumbnail()}
  {@const mino = Polyomino.of("01_11_01")}
  {@const children = [...mino.relatives.freeChildren()]}
  {@const radius = 30}
  <svg viewBox="-50 -10 100 50">
    {#each children as child, i}
      {@const angle =
        (i / (children.length - 1)) * Math.PI * (22 / 24) + Math.PI / 24}
      {@const coord = new Vector(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
      )}
      <line
        {...endpoints([0, 0], coord)}
        stroke="currentcolor"
        stroke-width={0.2}
      />
      <MinoSvg
        mino={child}
        fill={colors.bg}
        stroke="currentcolor"
        {coord}
        size={3}
      />
    {/each}
    <MinoSvg
      {mino}
      fill={colors.bg}
      stroke="currentcolor"
      coord={new Vector(0, 0)}
      size={4}
    />
  </svg>
{/snippet}

<style>
  .cards {
    display: grid;
    grid-auto-rows: 1fr;
    gap: 1rem;
    font-size: 1rem;

    grid-template-columns: repeat(1, 1fr);
  }

  .cards a {
    border: 1px solid var(--color-border);
    text-decoration: none;
    transition: background-color 150ms ease-in-out;
  }
  .cards a:hover {
    background-color: var(--color-bg2);
  }

  .cards .thumbnail-wrapper {
    height: 12rem;
    background-color: var(--color-bg);
    overflow: hidden;
  }

  .cards .text {
    padding: 0.5rem;
  }

  @media (min-width: 40rem) {
    .cards {
      grid-template-columns: repeat(2, 1fr);
    }

    .cards .thumbnail-wrapper {
      height: 10rem;
    }
  }

  @media (min-width: 48rem) {
    .cards {
      grid-template-columns: repeat(3, 1fr);
    }

    .cards .thumbnail-wrapper {
      height: 8rem;
    }
  }

  .catalog {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    margin: 0.5rem;
    align-content: center;
    align-items: center;
    justify-items: center;
  }

  .symmetry {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 0.5rem;
    justify-items: center;
    align-items: center;
  }

  .class {
    margin: 0.5rem;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }

  .pattern {
    pointer-events: none;
  }
</style>
