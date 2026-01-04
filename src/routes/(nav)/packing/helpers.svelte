<script module lang="ts">
  import type { Snippet } from "svelte"

  const packingPatterns: Record<string, Snippet> = {
    "5-rect": rect5,
    "5-square": square5,
    "6-rect": rect6,
    "6-square": square6,
    "7-rect": rect7,
    "7-square": square7,
    "8-rect": rect8,
    "8-square": square8,
  }

  export function getAttribution(patternName: string) {
    return packingPatterns[patternName]
  }
</script>

{#snippet golombBook()}
  <a
    href="https://press.princeton.edu/books/paperback/9780691024448/polyominoes"
  >
    Polyominoes: Puzzles, Patterns, Problems, and Packings - Revised and
    expanded second edition
  </a> by Solomon Golomb
{/snippet}

{#snippet polyPages(href: string)}
  <a {href}>The Poly Pages</a> by Andrew L Clarke.
{/snippet}

{#snippet rect5()}
  <a
    href="https://en.wikipedia.org/wiki/Pentomino#Constructing_rectangular_dimensions"
    target="_blank"
  >
    Pentomino
  </a>, Wikipedia
{/snippet}

{#snippet square5()}
  {@render golombBook()}: 7, Figure 11
{/snippet}

{#snippet rect6()}
  {@render polyPages("http://www.recmath.com/PolyPages/hexopatts.htm")},
  "Hexomino Constructions"
{/snippet}

{#snippet square6()}
  {@render polyPages("http://www.recmath.com/PolyPages/hexopatts.htm")},
  "Hexomino Constructions"
{/snippet}

{#snippet rect7()}
  {@render golombBook()}: 72, Figure 103
{/snippet}

{#snippet square7()}
  {@render polyPages("http://www.recmath.com/PolyPages/Polyominoes.htm")},
  "Heptominoes"
{/snippet}

{#snippet rect8()}
  {@render golombBook()}: 113, Figure 175
{/snippet}

{#snippet square8()}
  {@render golombBook()}: 114, Figure 179
{/snippet}
