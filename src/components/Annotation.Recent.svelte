<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  const { color } = getContext("App");
  const { xGet, xRange, yRange, yGet } = getContext("LayerCake");

  export let w;
  export let data;
  export let m;

  $: mid = $xRange[1] / 2;

  const getFill = (d) =>
    d.highlight === "latest"
      ? color.tertiary
      : d.highlight === "hot" || d.highlightAlt === "example2"
      ? color.secondary
      : color.primary;
</script>

{#each data as d (d.highlight)}
  {@const alt = d.annotationAlt}
  {@const x = $xGet(d) - w}
  {@const left = `${x - m}px`}
  {@const top = `${$yGet(d)}px`}
  {@const fill = getFill(d)}
  {@const text = d.annotation.text}
  {@const temp = d.temp}
  {@const arrow = d.annotation.type === "arrow"}
  {@const forceTemp = d.highlightAlt === "example2"}

  <p
    in:fade={{ delay: 2000 }}
    out:fade={{ duration: 150 }}
    class="shadow"
    class:forceTemp
    class:arrow
    style:left
    style:top
    style="--fill: {fill}; --col: {w}px;"
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
    padding: 0 0.5em;
    transform: translate(-100%, -0.75rem);
    text-align: right;
    font-size: 12px;
    z-index: var(--z-top);
  }

  p.arrow {
    --w: 66px;
    --h: 56px;
    width: calc(var(--w) * 1.25);
    padding: 0;
    padding-right: 0.5rem;
    padding-top: calc(var(--h) - 11px);
    text-align: left;
    line-height: 1.2;
    transform: translate(-100%, 0);
  }

  p:after {
    display: block;
    content: attr(data-temp);
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: 0.5rem;
    transform: translate(var(--col), 0);
  }

  p.arrow:after {
    display: none;
  }

  p.arrow.forceTemp:after {
    display: block;
    transform: translate(var(--col), -0.75rem);
  }

  p.arrow:before {
    content: "";
    display: block;
    position: absolute;
    top: -11px;
    right: 0;
    width: var(--w);
    height: var(--h);
    background-image: url("data:image/png;base64,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");
    background-repeat: no-repeat;
    margin: 0 auto;
  }

  @media only screen and (min-width: 640px) {
    p {
      font-size: 16px;
    }

    p.arrow {
      width: calc(var(--w) * 1.5);
    }
  }
</style>
