<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  const { color } = getContext("App");
  const { xGet, yGet, xRange } = getContext("LayerCake");

  export let w;
  export let data;
</script>

{#each data as d, i (i)}
  {@const left = `${$xGet(d) - w}px`}
  {@const top = `${$yGet(d)}px`}
  {@const flip = $xGet(d) > $xRange[1] * 0.67}
  {@const alltime = d.highlight === "alltime"}
  {@const delay = d.highlightAlt === "example1" ? 500 : 0}
  {@const duration = d.highlightAlt === "example1" ? 250 : 0}
  <div
    class="c"
    in:fade={{ delay: alltime ? 2000 : 500 }}
    out:fade={{ delay, duration }}
    style:left
    style:top
    class:flip
    class:alltime
  >
    <span class="circle" style="--w: {w}px;" />
    {#if d.annotation && data.length === 1}
      <p class="shadow">
        {d.annotation.text}
      </p>
    {/if}
  </div>
{/each}

<style>
  .c {
    position: absolute;
    top: 0;
    left: 50%;
    transition: all 1s ease-in-out;
  }

  .alltime {
    transition: none;
  }

  .circle {
    display: block;
    width: 1rem;
    height: 1rem;
    margin-left: calc(var(--w) * 0.5);
    transform: translate(-50%, -50%);
    border: 2px solid var(--color-fg);
    outline: 2px solid var(--color-bg);
    border-radius: 1rem;
  }

  p {
    color: var(--color-fg);
    font-family: var(--font-form);
    margin: 0;
    font-size: 14px;
    z-index: var(--z-top);
    margin-top: -12px;
    line-height: 24px;
    transform: translate(1rem, -1rem);
    max-width: 10rem;
    font-weight: 600;
  }

  .flip p {
    transform: translate(-110%, -1rem);
    text-align: right;
  }

  @media only screen and (min-width: 640px) {
    p {
      font-size: 16px;
    }
  }
</style>
