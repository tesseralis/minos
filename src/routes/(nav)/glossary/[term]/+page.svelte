<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte"
  import { page } from "$app/state"
  const { data } = $props()
  const Content = $derived(data.content)
</script>

<Breadcrumbs
  paths={[
    ["Glossary", "/glossary"],
    [data.title, `/glossary/${page.params.term}`],
  ]}
/>
<h1>{data.title}</h1>
<Content />
