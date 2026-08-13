<script lang="ts">
  import Compass from "$lib/components/Compass/Compass.svelte"
  import Nav from "$lib/components/Nav"
  import panzoom from "panzoom"
  import FullScreenSvg from "./FullScreenSvg.svelte"
  import GenerationRings from "./GenerationRings.svelte"
  import MinoLinks from "./MinoLinks.svelte"
  import type { Polyomino } from "$lib/mino"
  import onClickOnly from "$lib/components/onClickOnly"
  import { pageTitle } from "$lib/components/theme"

  let selected: Polyomino | undefined = $state()
</script>

<svelte:head>
  <title>{pageTitle("Genealogy")}</title>
</svelte:head>

<div class="container">
  <FullScreenSvg width={1100}>
    <rect
      width="100%"
      height="100%"
      opacity={0}
      {@attach onClickOnly(() => {
        selected = undefined
      })}
    />
    <g
      {@attach (el: SVGGElement) => {
        const instance = panzoom(el, {
          minZoom: 0.25,
          maxZoom: 2,
          zoomSpeed: 0.075,
          smoothScroll: false,
        })
        return () => {
          instance.dispose()
        }
      }}
    >
      <MinoLinks bind:selected />
      <GenerationRings bind:selected />
    </g>
  </FullScreenSvg>
  <div class="nav-wrapper">
    <Nav />
  </div>
  <div class="compass-wrapper">
    {#if selected}
      <Compass bind:selected />
    {/if}
  </div>
</div>

<style>
  .container {
    position: absolute;
    inset: 0;
  }

  .nav-wrapper {
    position: absolute;
    top: 0;
    left: 0;
  }

  @media (min-width: 64rem) {
    .nav-wrapper {
      top: 2rem;
    }
  }

  .compass-wrapper {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    pointer-events: none;
  }

  @media (min-width: 40rem) {
    .compass-wrapper {
      top: 0;
      right: 0;
      transform: initial;
    }
  }
</style>
