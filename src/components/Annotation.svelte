<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  const { color } = getContext("App");
  const { data, xGet, xRange, yRange, yGet } = getContext("LayerCake");

  export let w;
  export let d;
  export let m;

  $: mid = $xRange[1] / 2;
  $: x = $xGet(d) - w;
  $: left = `${x - m}px`;
  $: top = `${$yGet(d)}px`;
  $: forceRight = x < mid;
  $: align = forceRight ? "left" : "right";
  $: tx = forceRight ? `${w + m * 2}px` : "-100%";
  $: fill =
    d.highlight === "latest"
      ? color.tertiary
      : d.highlight === "hot"
      ? color.secondary
      : color.primary;
</script>

{#key d.highlight}
  <p
    transition:fade
    style:left
    style:top
    style="--fill: {fill}; --tx: {tx};"
    style:text-align={align}
  >
    {d.annotation}
  </p>
{/key}

<style>
  p {
    --fill: var(--color-fg);
    --tx: 0;
    color: var(--fill);
    font-family: var(--font-form);
    font-size: 0.8em;
    position: absolute;
    margin: 0;
    padding: 0.5em;
    max-width: 8em;
    transform: translate(var(--tx), -0.7em);
    text-shadow: -3px -3px 1px var(--color-bg), -3px -2px 1px var(--color-bg),
      -3px -1px 1px var(--color-bg), -3px 0px 1px var(--color-bg),
      -3px 1px 1px var(--color-bg), -3px 2px 1px var(--color-bg),
      -3px 3px 1px var(--color-bg), -2px -3px 1px var(--color-bg),
      -2px -2px 1px var(--color-bg), -2px -1px 1px var(--color-bg),
      -2px 0px 1px var(--color-bg), -2px 1px 1px var(--color-bg),
      -2px 2px 1px var(--color-bg), -2px 3px 1px var(--color-bg),
      -1px -3px 1px var(--color-bg), -1px -2px 1px var(--color-bg),
      -1px -1px 1px var(--color-bg), -1px 0px 1px var(--color-bg),
      -1px 1px 1px var(--color-bg), -1px 2px 1px var(--color-bg),
      -1px 3px 1px var(--color-bg), 0px -3px 1px var(--color-bg),
      0px -2px 1px var(--color-bg), 0px -1px 1px var(--color-bg),
      0px 1px 1px var(--color-bg), 0px 2px 1px var(--color-bg),
      0px 3px 1px var(--color-bg), 1px -3px 1px var(--color-bg),
      1px -2px 1px var(--color-bg), 1px -1px 1px var(--color-bg),
      1px 0px 1px var(--color-bg), 1px 1px 1px var(--color-bg),
      1px 2px 1px var(--color-bg), 1px 3px 1px var(--color-bg),
      2px -3px 1px var(--color-bg), 2px -2px 1px var(--color-bg),
      2px -1px 1px var(--color-bg), 2px 0px 1px var(--color-bg),
      2px 1px 1px var(--color-bg), 2px 2px 1px var(--color-bg),
      2px 3px 1px var(--color-bg), 3px -3px 1px var(--color-bg),
      3px -2px 1px var(--color-bg), 3px -1px 1px var(--color-bg),
      3px 0px 1px var(--color-bg), 3px 1px 1px var(--color-bg),
      3px 2px 1px var(--color-bg), 3px 3px 1px var(--color-bg);
    z-index: var(--z-top);
  }
</style>
