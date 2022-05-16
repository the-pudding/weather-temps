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
  <div
    in:fade={{ delay: 1000 }}
    out:fade={{ duration: 150 }}
    style:left
    style:top
    class:flip
  >
    <span style="--w: {w}px;" />
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
    margin-left: calc(var(--w) * 0.5);
    transform: translate(-50%, -50%);
    border: 2px solid var(--color-bg);
    outline: 2px solid var(--color-fg);
    border-radius: 50%;
  }

  p {
    color: var(--color-fg);
    font-family: var(--font-form);
    margin: 0;
    font-size: 16px;
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

  @media only screen and (max-width: 475px) {
    p:nth-of-type(n + 2) {
      max-width: 260px;
    }

    .subtext {
      font-size: 18px;
    }
    
    p {
      font-size: 14px
    }
  }


</style>
