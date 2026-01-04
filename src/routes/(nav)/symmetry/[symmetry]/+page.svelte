<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { printSymmetry, type Symmetry } from "$lib/mino"
  import { capitalize } from "lodash-es"
  import MinoList from "../MinoList.svelte"

  const longName: Record<Symmetry, string> = {
    all: "Full symmetry",
    axis2: "Reflective symmetry (2 axes)",
    diag2: "Diagonal symmetry (2 diagonals)",
    rot2: "Rotational symmetry (4-fold)",
    axis: "Reflective symmetry (axis)",
    diag: "Reflective symmetry (diagonal)",
    rot: "Rotational symmetry (2-fold)",
    none: "Asymmetry",
  }

  const { data } = $props()
  const Content = $derived(data.content)
  const symmetry = $derived(data.symmetry)
</script>

<Breadcrumbs
  paths={[
    ["Symmetry", "/symmetry"],
    [capitalize(printSymmetry(symmetry)), `/symmetry/${symmetry}`],
  ]}
/>
<h1>
  {longName[symmetry]}
</h1>
<Content />
<h2>Polyomino list</h2>
<MinoList {symmetry} />

<style>
  h1 {
    margin: 0;
  }
</style>
