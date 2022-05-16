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
  {@const offset = d.annotation.offset || 0}
  {@const text = d.annotation.text}
  {@const temp = d.temp}
  {@const forceTemp =
    d.highlightAlt === "example1" || d.highlightAlt === "example2"}
  {@const flip = $xGet(d) < $xRange[1] * 0.5}

  <p
    in:fade={{ delay: 2000 }}
    out:fade={{ duration: 150 }}
    class="shadow {d.annotation.type}"
    class:flip
    class:forceTemp
    style:left
    style:top
    style:opacity
    style="--fill: {fill}; --w: {w}px; --offset: {offset};"
    data-temp="{temp}°F"
  >
    <span>{text}</span>
  </p>
{/each}

<style>
  p {
    --pad: 16px;
    --diam: calc(var(--w) + var(--pad));
    --fill: var(--color-fg);
    color: var(--fill);
    font-family: var(--font-form);
    position: absolute;
    margin: 0;
    margin-top: calc(var(--offset) * 16px);
    transform: translate(-100%, -8px);
    text-align: right;
    font-size: 16px;
    font-weight: 600;
    z-index: var(--z-top);
    line-height: 1.2;
    padding-right: 0.5em;
    width: 100%;
  }

  span {
    display: block;
  }

  p.wrap {
    width: 10rem;
    padding-right: var(--pad);
  }

  p.wrap:after {
    content: "";
    position: absolute;
    top: 8px;
    right: -2px;
    display: block;
    width: var(--diam);
    height: var(--diam);
    border-radius: 50%;
    border: 2px solid var(--color-fg);
    transform: translate(calc(var(--diam) - (var(--pad) * 0.5)), -50%);
    outline: 2px solid var(--color-bg);
  }

  p.wrap.flip span {
    text-align: left;
    transform: translate(calc(100% + var(--diam)), 0);
    padding-right: 0;
    padding-left: 1.5em;
  }
</style>
