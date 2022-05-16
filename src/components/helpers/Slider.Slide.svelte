<script>
  import { getContext } from "svelte";
  const { direction, width, height } = getContext("Slider");

  export let center;
  $: w = $direction === "horizontal" ? `${$width}px` : "100%";
  $: h = $direction === "vertical" ? `${$height}px` : "100%";
</script>

<div class="slide" class:center style="width: {w}; height: {h};">
  <slot />
</div>

<style>
  .slide {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 1.25rem;
  }

  :global(.subtext) {
    font-family: var(--sans);
    font-size: 1rem;
  }

  @media only screen and (min-width: 640px) {
    .slide {
      font-size: 1.5rem;
    }

    :global(.subtext) {
      font-size: 1.125rem;
    }
  }

  @media only screen and (min-width: 1024px) {
    .slide {
      font-size: 2rem;
    }
    :global(.subtext) {
      font-size: 1.25rem;
    }
  }
</style>
