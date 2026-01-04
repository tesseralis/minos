<script lang="ts">
  const { data } = $props()
  const Content = $derived(data.content)
</script>

<h1>{data.title}</h1>
<Content />
