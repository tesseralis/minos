<script lang="ts">
  import MinoDiv, { type Props as MinoDivProps } from "./MinoDiv.svelte"

  interface Props extends Omit<MinoDivProps, "onClick"> {
    href: string
  }

  const { href, ...props }: Props = $props()
</script>

<a {href}>
  <MinoDiv {...props} />
</a>

<style>
  a :global(svg) {
    transition: transform 150ms ease-in-out;
  }
  a :global(svg:hover) {
    transform: scale(1.1);
  }
</style>
