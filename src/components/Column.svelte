<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  const { color } = getContext("App");
  const { data, xGet, yRange, yScale } = getContext("LayerCake");

  export let w;
  export let d;
  export let m;
  export let temp;

  $: width = `${w + m * 2}px`;
  $: left = `${$xGet(d) - w - m}px`;
  $: y = $yScale(temp + 3);
  $: top = `${y}px`;
  $: height = `${$yRange[0] - y}px`;
  $: fill =
    d.highlight === "latest"
      ? color.tertiaryT
      : d.highlight === "hot"
      ? color.secondaryT
      : color.primaryT;
</script>

{#key d.highlight}
  <div
    transition:fade
    style:left
    style:top
    style:width
    style:height
    style="--fill: {fill};"
  />
{/key}

<style>
  div {
    --fill: rgba(255, 255, 255, 0.3);
    position: absolute;
    /* top: 0; */
    height: 100%;
    background: linear-gradient(var(--fill) 75%, rgba(255, 255, 255, 0) 96%);
    border: 0px solid var(--color-bg);
  }
</style>
