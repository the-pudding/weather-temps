<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  const { color } = getContext("App");
  const { data, xGet, yRange } = getContext("LayerCake");

  export let w;
  export let d;
  export let m;

  $: width = `${w + m * 2}px`;
  $: left = `${$xGet(d) - w - m}px`;
  $: fill =
    d.highlight === "latest"
      ? color.tertiaryT
      : d.highlight === "hot"
      ? color.secondaryT
      : color.primaryT;
</script>

{#key d.highlight}
  <div transition:fade style:left style:width style="--fill: {fill};" />
{/key}

<style>
  div {
    --fill: rgba(255, 255, 255, 0.3);
    position: absolute;
    top: 0;
    height: 100%;
    background: linear-gradient(var(--fill) 75%, rgba(255, 255, 255, 0));
  }
</style>
