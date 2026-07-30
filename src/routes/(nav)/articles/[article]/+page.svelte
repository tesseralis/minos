<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { page } from "$app/state"
  import { pageTitle } from "$lib/components/theme.js"
  const { data } = $props()
  const Content = $derived(data.content)
</script>

<!-- <svelte:head>
  <title>{pageTitle(data.title)}</title>
</svelte:head> -->

<!-- <Breadcrumbs
  paths={[
    ["Glossary", "/glossary"],
    // [data.title, `/glossary/${page.params.term}`],
  ]}
/> -->
<!-- <h1>{data.title}</h1> -->
<Content />
