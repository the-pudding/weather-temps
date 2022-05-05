<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  const { color } = getContext("App");
  const { xGet, yGet, xRange } = getContext("LayerCake");

  export let w;
  export let data;
</script>

{#each data as d (d.day)}
  {@const left = `${$xGet(d) - w}px`}
  {@const top = `${$yGet(d)}px`}
  {@const flip = $xGet(d) > $xRange[1] * 0.67}
  <div transition:fade style:left style:top class:flip>
    <span />
    {#if d.annotation && data.length === 1}
      <p class="shadow">
        {d.annotation.text}
      </p>
    {/if}
  </div>
{/each}

<style>
  div {
    position: absolute;
  }

  span {
    display: block;
    width: 1rem;
    height: 1rem;
    transform: translate(-50%, -50%);
    border: 1px solid var(--color-bg);
    border-radius: 50%;
    background: var(--color-white);
    box-shadow: 0 0 6px 6px var(--color-transparent),
      0 0 12px 12px var(--color-transparent);
  }

  p {
    color: var(--color-fg);
    font-family: var(--font-form);
    margin: 0;
    font-size: 12px;
    z-index: var(--z-top);
    margin-top: -12px;
    line-height: 24px;
    transform: translate(1rem, -1rem);
    max-width: 10rem;
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
