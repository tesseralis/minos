<script lang="ts">
  import { chunk } from "lodash-es"
  import { getDirColor } from "./helpers"

  interface Props {
    word: string
    currentIndex: number
  }
  function getWordSegments(word: string) {
    // reconfigure the word so that it starts with the first "ru" after a "d" (ie, the bottom-left)
    const startIndex = word.indexOf("dru") + 1
    const cycled = word.substring(startIndex) + word.substring(0, startIndex)
    const segments = chunk(cycled, 2).map((segment) => segment.join(""))
    const groupedSegments = []
    let current = { dir: segments[0], count: 0 }
    for (const segment of segments) {
      if (segment !== current.dir) {
        groupedSegments.push(current)
        current = {
          dir: segment,
          count: 1,
        }
      } else {
        current.count++
      }
    }
    groupedSegments.push(current)
    return groupedSegments
  }

  let { word, currentIndex = $bindable(-1) }: Props = $props()
  const segments = $derived(getWordSegments(word))
</script>

<div class="boundary-word">
  {#each segments as { dir, count }, index}
    <span
      style:color={index === currentIndex ? "white" : getDirColor(dir)}
      onpointerover={() => {
        currentIndex = index
      }}
      onfocus={() => {
        currentIndex = index
      }}
      onpointerout={() => {
        currentIndex = -1
      }}
      onblur={() => {
        currentIndex = -1
      }}
    >
      {dir}{#if count > 1}
        <sup>{count}</sup>
      {/if}
    </span>
  {/each}
</div>

<style>
  .boundary-word {
    font-family: monospace;
    display: flex;
    gap: 0.25rem;
    align-items: baseline;
    margin-bottom: 0.5rem;
  }
</style>
