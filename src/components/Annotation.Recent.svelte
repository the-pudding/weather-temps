<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  const { color } = getContext("App");
  const { xGet, xRange, yRange, yGet } = getContext("LayerCake");

  export let w;
  export let data;
  export let m;

  $: mid = $xRange[1] / 2;
</script>

{#each data as d (d.daysSinceNow)}
  {@const alt = d.annotationAlt}
  {@const x = $xGet(d) - w}
  {@const left = `${x - m}px`}
  {@const top = `${$yGet(d)}px`}
  {@const fill = color[d.annotation.color] || "#fff"}
  {@const opacity = d.annotation.color ? 1 : 0.7}
  {@const text = d.annotation.text}
  {@const temp = d.temp}
  {@const forceTemp = d.highlightAlt === "example2"}

  <p
    in:fade={{ delay: 2000 }}
    out:fade={{ duration: 150 }}
    class="shadow {d.annotation.type}"
    class:forceTemp
    style:left
    style:top
    style:opacity
    style="--fill: {fill}; --w: {w}px;"
    data-temp="{temp}°F"
  >
    {text}
  </p>
{/each}

<style>
  p {
    --fill: var(--color-fg);
    color: var(--fill);
    font-family: var(--font-form);
    position: absolute;
    margin: 0;
    transform: translate(-100%, -8px);
    text-align: right;
    font-size: 16px;
    font-weight: 600;
    z-index: var(--z-top);
    line-height: 1.2;
    padding-right: 0.5em;
  }

  p.wrap {
    width: 10rem;
    padding-right: calc(var(--w) * 1.5);
  }

  p.wrap:after {
    content: "";
    position: absolute;
    top: 8px;
    right: -2px;
    display: block;
    width: calc(var(--w) * 3);
    height: calc(var(--w) * 3);
    border-radius: 50%;
    border: 2px solid var(--color-fg);
    transform: translate(calc(var(--w) * 2), -50%);
    outline: 2px solid var(--color-bg);
  }
</style>
