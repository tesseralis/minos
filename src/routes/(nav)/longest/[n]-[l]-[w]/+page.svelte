<script lang="ts">
  import { nodes } from "$lib/components/graph"
  import LongestMarkers from "$lib/components/LongestMarkers.svelte"
  import MinoDiv from "$lib/components/MinoDiv.svelte"

  const { params } = $props()
  const { n, l, w } = $derived(params)

  console.log(n, l, w)

  const minos = $derived(
    nodes[+n - 1].filter(
      (mino) => mino.longestLine().max === +l && mino.longestWave().max === +w,
    ),
  )
</script>

{#each minos as mino}
  <MinoDiv {mino} size={12}>
    <LongestMarkers {mino} size={12} stroke="white" stroke-width="2" />
  </MinoDiv>
{/each}
